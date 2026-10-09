import { pricing } from '../config/pricing.js'
import { getRate, bandLabel, formatRand } from '../config/rates.js'
import { itemById } from '../config/items.js'

const isAmount = (v) => typeof v === 'number' && Number.isFinite(v)

/** Distance part of the quote, from the rate bands (default) or a per-km model. */
function distanceFee(km) {
  if (pricing.distanceMode === 'perKm') {
    if (!isAmount(pricing.perKmRate)) return { amount: null, label: `Distance (${km} km)` }
    const chargeable = Math.max(0, km - (isAmount(pricing.includedKm) ? pricing.includedKm : 0))
    return { amount: Math.round(chargeable * pricing.perKmRate), label: `Distance (${km} km)` }
  }
  const rate = getRate(km)
  if (rate.status === 'priced') return { amount: rate.price, label: `Distance (${bandLabel(rate.band)})`, band: rate.band }
  if (rate.status === 'over') return { over: true }
  return { invalid: true }
}

/**
 * Estimated Quick Book quote.
 *   base fee + distance fee + item fees × quantity + surcharges, at least the minimum charge.
 * Values still marked CLIENT TO CONFIRM (null) are left out and listed in `pending`,
 * and the total is then shown as "From R…".
 *
 * Returns { status: 'no-distance' | 'invalid-distance' | 'over' | 'ok', lines, total, isFrom, pending, km }
 */
export function calculateQuote(booking) {
  const km = Number(booking.distance?.km)
  if (booking.distance?.km === '' || booking.distance?.km == null) return { status: 'no-distance', lines: [], total: null, pending: [] }
  if (!Number.isFinite(km) || km <= 0) return { status: 'invalid-distance', lines: [], total: null, pending: [] }
  const kmRounded = Math.round(km * 10) / 10

  const lines = []
  const pending = []
  const add = (label, amount) => {
    if (isAmount(amount)) lines.push({ label, amount })
    else pending.push(label)
  }

  if (pricing.baseFee !== null) add('Base fee', pricing.baseFee)

  const dist = distanceFee(kmRounded)
  if (dist.over) return { status: 'over', lines: [], total: null, pending: [], km: kmRounded }
  if (dist.invalid) return { status: 'invalid-distance', lines: [], total: null, pending: [], km: kmRounded }
  add(dist.label, dist.amount)

  for (const it of booking.items || []) {
    const qty = Math.max(1, Number(it.qty) || 1)
    const fee = pricing.items[it.id]?.fee
    const name = itemById[it.id]?.short || it.id
    if (isAmount(fee)) lines.push({ label: `${qty} × ${name}`, amount: fee * qty })
    else pending.push(`${qty} × ${name}`)
  }

  // Surcharges apply only when the client has set a fee AND the condition is true.
  const s = pricing.surcharges
  const conditions = {
    stairs: Boolean(booking.delivery?.stairs),
    afterHours: booking.timeSlot === '18-20',
    sameDay: booking.date === 'today',
  }
  for (const [key, applies] of Object.entries(conditions)) {
    if (applies && isAmount(s[key]?.fee)) lines.push({ label: s[key].label, amount: s[key].fee })
  }

  let total = lines.reduce((sum, l) => sum + l.amount, 0)
  if (isAmount(pricing.minimumCharge) && total < pricing.minimumCharge) {
    lines.push({ label: 'Minimum charge adjustment', amount: pricing.minimumCharge - total })
    total = pricing.minimumCharge
  }

  return { status: 'ok', lines, total, isFrom: pending.length > 0, pending, km: kmRounded, band: dist.band }
}

/** "R850" or "From R850" for display and messages. */
export function quoteTotalLabel(quote) {
  if (!quote || quote.status !== 'ok') return null
  return `${quote.isFrom ? 'From ' : ''}${formatRand(quote.total)}`
}
