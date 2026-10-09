import { itemById } from '../config/items.js'
import { scenarioById, collectionTypes, propertyTypes } from '../config/scenarios.js'
import { schedule, slotLabel } from '../config/timeSlots.js'
import { getQuickBookDays } from './availability.js'
import { quoteTotalLabel } from './calculateQuote.js'

const t = (v) => (typeof v === 'string' ? v.trim() : v)
const labelOf = (list, value) => list.find((o) => o.value === value)?.label

/** "1 × Fridge" lines, with descriptions for "Other" items. */
export function itemLines(items = []) {
  return items
    .filter((it) => itemById[it.id])
    .map((it) => {
      const name = itemById[it.id].short
      const desc = t(it.description)
      return `${Math.max(1, Number(it.qty) || 1)} × ${name}${desc ? ` (${desc})` : ''}`
    })
}

export function dateLabel(booking, now = new Date()) {
  const days = getQuickBookDays(now)
  if (booking.date === 'today') return `Today (${days.today.label})`
  if (booking.date === 'tomorrow') return `Tomorrow (${days.tomorrow.label})`
  if (booking.date === 'later') return 'A later date (please arrange with me)'
  return ''
}

/**
 * The Quick Book WhatsApp message. Works with a partly completed booking:
 * every detail already entered is included, empty sections are left out.
 */
export function buildBookingMessage(booking, { quote, bookingId, now = new Date() } = {}) {
  const blocks = []
  const block = (title, lines) => {
    const clean = lines.map(t).filter(Boolean)
    if (clean.length) blocks.push(`${title}:\n${clean.join('\n')}`)
  }

  const c = booking.collection || {}
  const d = booking.delivery || {}
  const cust = booking.customer || {}
  const slot = schedule.slots.find((s) => s.id === booking.timeSlot)

  block('Booking Type', [scenarioById[booking.scenario]?.label])
  if (bookingId) block('Booking Reference', [bookingId])
  block('Items', itemLines(booking.items))
  block('Collection', [
    c.type === 'store' ? c.storeName : labelOf(collectionTypes, c.type),
    c.address,
    c.contactName && `Contact: ${t(c.contactName)}`,
    c.notes && `Notes: ${t(c.notes)}`,
  ])
  block('Delivery', [
    d.address,
    d.propertyType && `Property: ${labelOf(propertyTypes, d.propertyType)}`,
    d.contactName && `Contact: ${t(d.contactName)}`,
    d.contactNumber && `Contact number: ${t(d.contactNumber)}`,
    d.stairs && 'Stairs, no lift',
    d.access && `Access: ${t(d.access)}`,
    d.notes && `Notes: ${t(d.notes)}`,
  ])
  block('Date', [dateLabel(booking, now)])
  if (booking.date !== 'later') block('Time', [slot && slotLabel(slot)])
  const km = Number(booking.distance?.km)
  block('Distance', [Number.isFinite(km) && km > 0 ? `${Math.round(km * 10) / 10} km${booking.distance?.source === 'manual' ? ' (approx.)' : ''}` : ''])
  block('Estimated Quote', [quoteTotalLabel(quote)])
  block('Name', [cust.name])
  block('WhatsApp', [cust.whatsapp])
  if (t(cust.phone)) block('Phone', [cust.phone])
  if (t(cust.email)) block('Email', [cust.email])

  return ['Hi Terrific Loads,', '', 'I’d like to arrange a delivery.', '', ...blocks.flatMap((b) => [b, '']), 'Please confirm availability.'].join('\n')
}
