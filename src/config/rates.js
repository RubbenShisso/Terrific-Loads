/**
 * Terrific Loads delivery prices, supplied by the client.
 * This is the only place prices live. Components read them through getRate().
 *
 * Standard prices by driving distance. Bands never overlap: each band includes
 * its upper number (exactly 10 km is R650, 10.1 km is R850).
 * Express Delivery is the standard price plus `expressExtra`.
 *
 * These prices cover ONE straightforward item on a single route. Multiple
 * items, extra stops, difficult access, unusually heavy items or special
 * handling are quoted on WhatsApp (see quoteOutcome in src/config/quote.js).
 */
export const rates = {
  currency: 'R',
  bands: [
    { from: 0, to: 10, price: 650 },
    { from: 10, to: 20, price: 850 },
    { from: 20, to: 30, price: 1000 },
    { from: 30, to: 40, price: 1200 },
    { from: 40, to: 50, price: 1500 },
    { from: 50, to: 60, price: 1700 },
  ],
  expressExtra: 150,
  maxPricedKm: 60,
  note: 'Indicative price for one straightforward item. Multiple items, extra stops, difficult access, unusually heavy items or special handling may need a revised quote.',
}

/** Formats a whole rand amount as "R1 000" (space as thousands separator). */
export function formatRand(amount) {
  const digits = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${rates.currency}${digits}`
}

/** "up to 10 km", "over 10 to 20 km". */
export const bandLabel = (band) => (band.from === 0 ? `up to ${band.to} km` : `over ${band.from} to ${band.to} km`)

/**
 * Prices for a driving distance.
 * Returns { status: 'invalid' } | { status: 'over', km } |
 *         { status: 'priced', km, band, standard, express }
 */
export function getRate(input) {
  const km = typeof input === 'number' ? input : Number(input)
  if (input === '' || input === null || input === undefined || !Number.isFinite(km) || km < 0) return { status: 'invalid' }
  if (km > rates.maxPricedKm) return { status: 'over', km }
  const band = rates.bands.find((b) => km <= b.to)
  return { status: 'priced', km, band, standard: band.price, express: band.price + rates.expressExtra }
}
