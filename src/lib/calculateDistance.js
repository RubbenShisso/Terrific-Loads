/**
 * Road distance and address autocomplete, via Google, when a key is set.
 *
 *   VITE_GOOGLE_MAPS_API_KEY  enables Places Autocomplete (Maps JavaScript API,
 *                             Places library) and road distance (Routes API).
 *
 * Without a key nothing is loaded and the booking flow asks the customer for a
 * rough distance instead, so the site never depends on Google to work.
 * Restrict the key to this site's domain in Google Cloud.
 */
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const mapsEnabled = Boolean(KEY)

export class DistanceError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

/** Driving distance between two free-text addresses (Routes API computeRoutes). */
export async function getRoadDistance(origin, destination, { signal } = {}) {
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

let placesPromise = null

/** Loads the Maps JavaScript API with the Places library once, on demand. */
export function loadPlaces() {
  if (!KEY || typeof window === 'undefined') return Promise.resolve(null)
  if (window.google?.maps?.places) return Promise.resolve(window.google)
  placesPromise ??= new Promise((resolve) => {
    window.__tlMapsReady = () => resolve(window.google)
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&libraries=places&region=ZA&loading=async&callback=__tlMapsReady`
    s.async = true
    s.onerror = () => resolve(null) // fall back to plain text entry
    document.head.appendChild(s)
  })
  return placesPromise
}
