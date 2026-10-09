/**
 * Quick Book pricing engine configuration (see src/lib/calculateQuote.js).
 *
 *   Estimated quote = base fee + distance fee + item fees × quantity + surcharges
 *   (never below the minimum charge)
 *
 * Every value marked CLIENT TO CONFIRM is `null`. A null value is never
 * guessed: it is left out of the total and the quote says that part will be
 * confirmed on WhatsApp. Nothing here changes the public quote calculator.
 *
 * Distance fee: by default it uses the client's real distance bands from
 * src/config/rates.js (R600 for 1 to 10 km, and so on). To switch to a per-km
 * model instead, set distanceMode to 'perKm' and fill in includedKm and perKmRate.
 */
export const pricing = {
  currency: 'R',
  distanceMode: 'bands', // 'bands' (rates.js) | 'perKm'

  baseFee: null, // CLIENT TO CONFIRM: call-out fee added to every booking, if any
  includedKm: null, // CLIENT TO CONFIRM (perKm mode): km included before perKmRate applies
  perKmRate: null, // CLIENT TO CONFIRM (perKm mode): rand per km after includedKm
  minimumCharge: null, // CLIENT TO CONFIRM: lowest total for any booking

  /** Per-item fees, charged per unit. Keys match src/config/items.js. */
  items: {
    couch: { label: 'Couch / Sofa', fee: null }, // CLIENT TO CONFIRM
    'dining-table': { label: 'Dining Table', fee: null }, // CLIENT TO CONFIRM
    'coffee-table': { label: 'Coffee Table', fee: null }, // CLIENT TO CONFIRM
    chairs: { label: 'Chairs', fee: null }, // CLIENT TO CONFIRM
    'bed-frame': { label: 'Bed Frame', fee: null }, // CLIENT TO CONFIRM
    mattress: { label: 'Mattress', fee: null }, // CLIENT TO CONFIRM
    desk: { label: 'Desk', fee: null }, // CLIENT TO CONFIRM
    cabinet: { label: 'Cabinet', fee: null }, // CLIENT TO CONFIRM
    'tv-stand': { label: 'TV Stand', fee: null }, // CLIENT TO CONFIRM
    'chest-of-drawers': { label: 'Chest of Drawers', fee: null }, // CLIENT TO CONFIRM
    'other-furniture': { label: 'Other Furniture', fee: null }, // CLIENT TO CONFIRM
    fridge: { label: 'Fridge', fee: null }, // CLIENT TO CONFIRM
    'washing-machine': { label: 'Washing Machine', fee: null }, // CLIENT TO CONFIRM
    'tumble-dryer': { label: 'Tumble Dryer', fee: null }, // CLIENT TO CONFIRM
    dishwasher: { label: 'Dishwasher', fee: null }, // CLIENT TO CONFIRM
    'large-tv': { label: 'Large TV', fee: null }, // CLIENT TO CONFIRM
    'large-appliance': { label: 'Large Appliance', fee: null }, // CLIENT TO CONFIRM
    'other-large': { label: 'Other Large Item', fee: null }, // CLIENT TO CONFIRM
  },

  /**
   * Optional surcharges. Applied only when a fee is set AND the condition is
   * true for the booking. None are shown to customers while their fee is null.
   */
  surcharges: {
    stairs: { label: 'Stairs (no lift)', fee: null }, // CLIENT TO CONFIRM
    afterHours: { label: 'Evening slot (18:00–20:00)', fee: null }, // CLIENT TO CONFIRM
    sameDay: { label: 'Same-day booking', fee: null }, // CLIENT TO CONFIRM
  },
}
