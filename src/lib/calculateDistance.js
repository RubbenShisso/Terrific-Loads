/**
 * Road distance through Google, when a key is set.
 *
 *   VITE_GOOGLE_MAPS_API_KEY  enables road distance through the Routes API.
 *
 * Without a key the free OpenStreetMap routing in routeDistance.js is used, so
 * the site never depends on Google to work. Address suggestions use Google Places
 * (falling back to OpenStreetMap). Restrict the key to this site's domain.
 */
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const mapsEnabled = Boolean(KEY)

export class DistanceError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

/**
 * Driving distance between free-text addresses (Routes API computeRoutes).
 * `via` is an optional list of stops in between, visited in order.
 */
export async function getRoadDistance(origin, destination, { signal, via = [] } = {}) {
  if (!KEY) throw new DistanceError('Maps is not configured.', 'not-configured')
  if (!origin?.trim() || !destination?.trim()) throw new DistanceError('Both addresses are needed.', 'missing-address')
  let res
  try {
    res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': KEY,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        ...(via.length ? { intermediates: via.map((address) => ({ address })) } : {}),
        travelMode: 'DRIVE',
        regionCode: 'ZA',
        units: 'METRIC',
      }),
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new DistanceError('Network error.', 'network')
  }
  if (!res.ok) throw new DistanceError(`Routes API error (${res.status}).`, 'http')
  const data = await res.json()
  const route = data.routes?.[0]
  if (!route?.distanceMeters) throw new DistanceError('No route found.', 'no-route')
  return {
    km: Math.round(route.distanceMeters / 100) / 10,
    durationMin: route.duration ? Math.round(parseInt(route.duration, 10) / 60) : null,
  }
}
