import { business } from './business.js'
import { bandLabel, formatRand } from './rates.js'

/** Chips for "What are we moving?" They only go into the message; they never change the price. */
export const itemOptions = ['Couch', 'Bed or mattress', 'Table', 'Cabinet or wardrobe', 'Fridge or freezer', 'Washing machine', 'Dishwasher', 'Other']

export const whenOptions = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'another day', label: 'Another day' },
]

/**
 * Builds the WhatsApp message. Lines the customer did not fill in are left out.
 * `rate` is the result of getRate(); `distanceLabel` overrides the distance text
 * when the customer picked a band chip instead of typing a number.
 */
export function buildQuoteMessage({ items = [], when = '', from = '', to = '', rate, distanceLabel } = {}) {
  const lines = [business.whatsapp.message]
  if (items.length) lines.push(`Items: ${items.map((i) => i.toLowerCase()).join(', ')}.`)
  if (when) lines.push(`When: ${when}.`)
  if (from.trim()) lines.push(`From: ${from.trim()}.`)
  if (to.trim()) lines.push(`To: ${to.trim()}.`)
  if (rate?.status === 'priced' || rate?.status === 'over') {
    const km = Number.isInteger(rate.km) ? rate.km : Number(rate.km.toFixed(1))
    lines.push(`Distance: ${distanceLabel ?? `about ${km} km`}.`)
  }
  if (rate?.status === 'priced') lines.push(`Estimated rate: ${formatRand(rate.price)} (${bandLabel(rate.band)}).`)
  return lines.join('\n')
}
