import { business } from './business.js'
import { rates } from './rates.js'

/**
 * Quick Book service-area rules. Components never hard-code areas; they call
 * src/lib/serviceAreaCheck.js, which reads this file.
 *
 * Addresses outside these rules are not rejected: the customer is offered
 * WhatsApp so the team can confirm availability.
 */
export const serviceAreas = {
  confirmWithClient: true,
  region: business.serviceAreas.summary, // "Cape Town & surrounding areas"

  /**
   * Areas Quick Book covers. Used when an address can be matched to a place
   * name (Google Places, when enabled). DRAFT: same broad areas as the
   * "Where we deliver" chips until the client confirms exact suburbs.
   */
  allowedAreas: ['Cape Town', ...business.serviceAreas.chips],

  /** Words that send an address straight to WhatsApp. CLIENT TO CONFIRM. */
  blockedAreas: [],

  /**
   * Address suggestions in the collection and delivery boxes (src/lib/locationSearch.js).
   * Results are limited to this box (Cape Town and surrounds, roughly Atlantis to
   * Hermanus and the Winelands) and ranked by distance from the centre point.
   */
  locationSearch: {
    centre: { lat: -33.9249, lon: 18.4241 }, // Cape Town city centre
    bbox: [17.7, -34.6, 19.9, -32.8], // minLon, minLat, maxLon, maxLat
    limit: 6,
  },

  /** Longest road distance Quick Book will price. Matches the last priced rate band. */
  maxQuickBookKm: rates.maxPricedKm, // 60 km; CLIENT TO CONFIRM
}
