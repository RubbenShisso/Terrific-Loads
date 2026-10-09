import { serviceAreas } from '../config/serviceAreas.js'

const norm = (s) => (s || '').toLowerCase()

/**
 * Is this booking inside the Quick Book area?
 * Returns { inside: true } or { inside: false, reason: 'blocked' | 'distance' | 'area' }.
 * Outside never means "rejected": the UI offers WhatsApp instead.
 */
export function checkServiceArea(booking) {
  const addresses = [booking.collection?.address, booking.delivery?.address].map(norm)

  const blocked = serviceAreas.blockedAreas.find((term) => addresses.some((a) => a.includes(norm(term))))
  if (blocked) return { inside: false, reason: 'blocked', term: blocked }

  const km = Number(booking.distance?.km)
  if (Number.isFinite(km) && km > serviceAreas.maxQuickBookKm) return { inside: false, reason: 'distance' }

  // Only when Google Places has identified the address: it must be in the
  // Western Cape or name one of the allowed areas.
  for (const place of [booking.collection?.place, booking.delivery?.place]) {
    if (!place) continue
    const text = norm(place)
    const known = text.includes('western cape') || serviceAreas.allowedAreas.some((a) => text.includes(norm(a)))
    if (!known) return { inside: false, reason: 'area' }
  }

  return { inside: true }
}
