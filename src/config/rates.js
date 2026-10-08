/**
 * Terrific Loads distance rates, supplied by the client.
 * This is the only place prices live. Components read them through getRate().
 *
 * Boundary rule: each band INCLUDES its upper number.
 *   exactly 10 km  -> R600 (1 to 10 km)
 *   10.1 km        -> R850 (10 to 20 km)
 *   exactly 60 km  -> R1 700 (50 to 60 km)
 *   above 60 km    -> no price, customer is asked to WhatsApp for a quote
 * (Client to confirm whether 10 km belongs to R600 or R850.)
 */
export const rates = {
  currency: 'R',
  bands: [
    { from: 1, to: 10, price: 600 },
    { from: 10, to: 20, price: 850 },
    { from: 20, to: 30, price: 1000 },
    { from: 30, to: 40, price: 1200 },
    { from: 40, to: 50, price: 1500 },
    { from: 50, to: 60, price: 1700 },
  ],
  maxPricedKm: 60,
  minKm: 1,
  maxKm: 999,
  note: 'Estimate only. We confirm your final quote on WhatsApp.',
  overMaxMessage: 'Over 60 km? WhatsApp us for a quote.',
}

/** Formats a whole rand amount as "R1 000" (space as thousands separator). */
export function formatRand(amount) {
  const digits = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${rates.currency}${digits}`
}

export const bandLabel = (band) => `${band.from} to ${band.to} km`

/**
 * Looks up the rate for a distance.
 * Returns { status: 'empty' | 'invalid' | 'priced' | 'over', band?, price?, message? }
 */
export function getRate(input) {
  if (input === '' || input === null || input === undefined) return { status: 'empty' }
  const km = typeof input === 'number' ? input : Number(input)
  if (!Number.isFinite(km)) return { status: 'invalid', message: 'Enter the distance as a number, for example 14.' }
  if (km <= 0) return { status: 'invalid', message: 'Distance needs to be more than 0 km.' }
  if (km < rates.minKm) return { status: 'invalid', message: `Enter at least ${rates.minKm} km.` }
  if (km > rates.maxKm) return { status: 'invalid', message: `Enter a distance up to ${rates.maxKm} km.` }
  if (km > rates.maxPricedKm) return { status: 'over', km, message: rates.overMaxMessage }
  // Upper bound is inclusive: the first band whose "to" is >= km.
  const band = rates.bands.find((b) => km <= b.to)
  return { status: 'priced', km, band, price: band.price }
}
