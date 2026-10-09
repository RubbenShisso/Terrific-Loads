/**
 * Terrific Loads distance rates, supplied by the client.
 * This is the only place prices live. Components read them through getRate().
 *
 * 5 km bands: within each 10 km stretch the second 5 km costs R25 more
 * (1 to 5 km R600, 5 to 10 km R625, 10 to 15 km R850, 15 to 20 km R875, ...).
 *
 * Boundary rule: each band INCLUDES its upper number.
 *   exactly 5 km   -> R600 (1 to 5 km)
 *   5.1 km         -> R625 (5 to 10 km)
 *   exactly 10 km  -> R625 (5 to 10 km)
 *   exactly 60 km  -> R1 725 (55 to 60 km)
 *   above 60 km    -> no price, customer is asked to WhatsApp for a quote
 * (Client to confirm which band each exact boundary belongs to.)
 */
export const rates = {
  currency: 'R',
  bands: [
    { from: 1, to: 5, price: 600 },
    { from: 5, to: 10, price: 625 },
    { from: 10, to: 15, price: 850 },
    { from: 15, to: 20, price: 875 },
    { from: 20, to: 25, price: 1000 },
    { from: 25, to: 30, price: 1025 },
    { from: 30, to: 35, price: 1200 },
    { from: 35, to: 40, price: 1225 },
    { from: 40, to: 45, price: 1500 },
    { from: 45, to: 50, price: 1525 },
    { from: 50, to: 55, price: 1700 },
    { from: 55, to: 60, price: 1725 },
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
