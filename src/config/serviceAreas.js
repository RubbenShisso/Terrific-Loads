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

  /** Longest road distance Quick Book will price. Matches the last priced rate band. */
  maxQuickBookKm: rates.maxPricedKm, // 60 km; CLIENT TO CONFIRM
}
