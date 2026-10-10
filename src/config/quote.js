import { business } from './business.js'
import { itemById } from './items.js'
import { rates, getRate, formatRand, bandLabel } from './rates.js'

/**
 * The quote flow (src/components/quote/QuoteFlow.jsx):
 *   items -> addresses and any extra stops -> delivery option -> details -> WhatsApp.
 * Wording for the delivery options is the client's own.
 */

/** Events other parts of the page send to the quote flow. */
export const QUOTE_EVENTS = {
  addItem: 'tl:quote-add-item', // detail: item id from items.js
  setDelivery: 'tl:set-delivery-area', // detail: area name
}

/** Extra stops between the collection and the delivery address. */
export const extraStops = { max: 6 }

export const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    price: 'standard',
    text: 'Same day or a later date, at the standard price. We agree the delivery time with you on WhatsApp.',
    dates: ['today', 'tomorrow', 'other'],
  },
  {
    id: 'express',
    label: 'Express Delivery',
    price: 'express',
    text: 'Target delivery within 3 hours. Subject to availability. Message us on WhatsApp to confirm availability before paying your deposit.',
    dates: ['today'],
  },
  {
    id: 'scheduled',
    label: 'Scheduled Delivery',
    price: 'standard',
    text: 'Next day or a future date, at the standard price. Your agreed time slot is reserved for you. We may do other deliveries before or after it, but we keep to the time we agreed.',
    dates: ['tomorrow', 'other'],
  },
  {
    id: 'budget',
    label: 'Budget-Friendly Request',
    price: null,
    text: 'Need delivery today but working with a tight budget? Depending on the item and delivery requirements, we may be able to offer you a lower price. Message us on WhatsApp, and we’ll see what we can arrange.',
    dates: ['today'],
  },
]
export const optionById = Object.fromEntries(deliveryOptions.map((o) => [o.id, o]))

export const totalQuantity = (list) => list.reduce((n, it) => n + (Number(it.qty) || 0), 0)

/**
 * Can the website show an indicative price for this job?
 * Only for ONE item on a single route whose driving distance was worked out
 * (not estimated) and is within 60 km. Everything else is quoted on WhatsApp.
 *
 * Returns { priced: true, rate } or { priced: false, reason } where reason is
 * 'multiple-stops' | 'multiple-items' | 'pending' | 'not-found' | 'no-route' | 'over' | 'incomplete'.
 */
export function quoteOutcome({ items = [], hasExtraStops = false, route = { status: 'idle' } }) {
  if (hasExtraStops) return { priced: false, reason: 'multiple-stops' }
  if (totalQuantity(items) > 1) return { priced: false, reason: 'multiple-items' }
  if (route.status === 'loading') return { priced: false, reason: 'pending' }
  if (route.status === 'not-found') return { priced: false, reason: 'not-found' }
  if (route.status === 'error' || (route.status === 'done' && route.source === 'estimate')) return { priced: false, reason: 'no-route' }
  if (route.status !== 'done') return { priced: false, reason: 'incomplete' }
  const rate = getRate(route.km)
  if (rate.status === 'over') return { priced: false, reason: 'over' }
  if (rate.status !== 'priced') return { priced: false, reason: 'no-route' }
  return { priced: true, rate }
}

/** The indicative price of an option, or null. */
export function optionPrice(option, outcome) {
  if (!outcome.priced || !option.price) return null
  return outcome.rate[option.price]
}

const reasonForMessage = {
  'multiple-stops': 'more than one stop',
  'multiple-items': 'more than one item',
  'not-found': 'an address could not be found',
  'no-route': 'the route could not be worked out',
  over: `the route is over ${rates.maxPricedKm} km`,
  pending: 'the distance was still being worked out',
  incomplete: 'the distance was not worked out',
}

// ---- Dates (South African time) ----
const TZ = 'Africa/Johannesburg'
/** "2026-10-10" for today in Cape Town. */
export const todayISO = (now = new Date()) => now.toLocaleDateString('en-CA', { timeZone: TZ })
export const addDaysISO = (iso, days) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
/** "Sat 10 Oct" */
export const shortDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** The chosen date as an ISO string, or '' if not chosen yet. */
export function resolveDate(option, choice, otherDate, now = new Date()) {
  if (!option) return ''
  const today = todayISO(now)
  const pick = option.dates.length === 1 ? option.dates[0] : choice
  if (pick === 'today') return today
  if (pick === 'tomorrow') return addDaysISO(today, 1)
  if (pick === 'other') return otherDate || ''
  return ''
}

export function dateText(iso, now = new Date()) {
  if (!iso) return ''
  const today = todayISO(now)
  if (iso === today) return `Today (${shortDate(iso)})`
  if (iso === addDaysISO(today, 1)) return `Tomorrow (${shortDate(iso)})`
  return shortDate(iso)
}

// ---- WhatsApp message ----
const clean = (v) => (typeof v === 'string' ? v.trim() : '')

/** "1 × Couch / Sofa", "1 × Other: glass display cabinet" */
export function itemLines(list = []) {
  return list
    .filter((it) => itemById[it.id] && Number(it.qty) > 0)
    .map((it) => {
      const item = itemById[it.id]
      const desc = clean(it.description)
      return `${it.qty} × ${item.needsDescription ? `Other: ${desc || 'not described'}` : item.label}`
    })
}

/** "18.4 km by road" or "about 18.4 km" */
export const routeDistanceText = (route) => (route.source === 'estimate' ? `about ${route.km} km` : `${route.km} km by road`)

/**
 * Builds the WhatsApp message from the quote flow's state. Empty details are left out.
 * `stops`: [{ role: 'collection' | 'collect' | 'deliver' | 'delivery', address, what }]
 */
export function buildQuoteMessage({ items = [], stops = [], route, outcome, option, date, name, phone, notes, now = new Date() } = {}) {
  const blocks = []
  const block = (title, lines) => {
    const list = lines.map(clean).filter(Boolean)
    if (list.length) blocks.push(`${title}:\n${list.join('\n')}`)
  }

  block('Items', itemLines(items))

  const multi = stops.length > 2
  const roleLabel = { collection: 'Collect from', collect: 'Collect from', deliver: 'Deliver to', delivery: 'Deliver to' }
  if (multi) {
    block(
      'Stops (in order)',
      stops
        .filter((s) => clean(s.address))
        .map((s, i) => `${i + 1}. ${roleLabel[s.role]}: ${clean(s.address)}${clean(s.what) ? ` (${clean(s.what)})` : ''}`),
    )
  } else {
    block('Collection address', [stops.find((s) => s.role === 'collection')?.address])
    block('Delivery address', [stops.find((s) => s.role === 'delivery')?.address])
  }

  if (route?.status === 'done') block('Route distance', [`${routeDistanceText(route)}${multi ? ', through all stops' : ''} (indicative)`])

  if (option) {
    block('Delivery option', [option.label])
    if (option.id === 'budget') block('Price', ['Budget-friendly request. Please let me know what you can arrange.'])
    else if (outcome?.priced) {
      const price = optionPrice(option, outcome)
      block('Indicative price', [`${formatRand(price)} (${bandLabel(outcome.rate.band)}). To be confirmed by Terrific Loads.`])
    } else if (outcome) block('Price', [`Please quote me (${reasonForMessage[outcome.reason] || 'manual quote needed'}).`])
  }

  block('Preferred date', [dateText(date, now)])
  block('Name', [name])
  block('Contact number', [phone])
  block('Notes', [notes])

  return [
    business.whatsapp.message,
    '',
    ...blocks.flatMap((b) => [b, '']),
    'I understand the price is indicative. The booking is confirmed once Terrific Loads has agreed to the job and the 50% deposit is paid.',
  ].join('\n')
}
