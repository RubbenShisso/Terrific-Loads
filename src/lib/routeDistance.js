/**
 * Driving distance through a list of stops (pickup, any stops, drop-off).
 *
 * Order of preference:
 *  1. Google Routes API, when VITE_GOOGLE_MAPS_API_KEY is set.
 *  2. OSRM driving route on OpenStreetMap data (free, no key). Defaults to the
 *     FOSSGIS server used by openstreetmap.org; set VITE_ROUTING_URL to your own.
 *  3. If routing is unavailable: straight-line distance × 1.3 per leg, marked as an estimate.
 *
 * Locations typed as free text are found with the same OpenStreetMap search
 * used for address suggestions. Only place names and coordinates are sent.
 */
import { searchLocations } from './locationSearch.js'
import { getRoadDistance, mapsEnabled } from './calculateDistance.js'

const ROUTER = (import.meta.env.VITE_ROUTING_URL || 'https://routing.openstreetmap.de/routed-car').replace(/\/$/, '')
const ROAD_FACTOR = 1.3 // straight line -> rough road distance, only when routing fails
const routeCache = new Map()
const round1 = (n) => Math.round(n * 10) / 10

/** Best match for a typed place (null if nothing found). */
export async function geocodePlace(text, { signal } = {}) {
  const [best] = await searchLocations(text, { signal })
  return best && Number.isFinite(best.lat) ? { lat: best.lat, lon: best.lon, label: best.label } : null
}

function straightLineKm(a, b) {
  const R = 6371
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

async function osrmRoute(points, signal) {
  const key = points.map((p) => `${p.lon},${p.lat}`).join(';')
  if (routeCache.has(key)) return routeCache.get(key)
  const res = await fetch(`${ROUTER}/route/v1/driving/${key}?overview=false`, { signal })
  if (!res.ok) throw new Error(`Routing failed (${res.status})`)
  const data = await res.json()
  const route = data.code === 'Ok' && data.routes?.[0]
  if (!route) throw new Error('No route found')
  const out = { km: round1(route.distance / 1000), minutes: Math.round(route.duration / 60), source: 'road' }
  routeCache.set(key, out)
  return out
}

/**
 * Distance through `stops`, in order. Each stop is { text, point? } where point
 * is { lat, lon } from a picked suggestion (skips the lookup).
 * Returns { km, minutes|null, source: 'google' | 'road' | 'estimate' } or
 * { notFound: index } for the first stop that could not be found.
 */
export async function routeThrough(stops, { signal } = {}) {
  if (stops.length < 2) throw new Error('At least two stops are needed.')
  if (mapsEnabled) {
    const texts = stops.map((s) => s.text)
    const r = await getRoadDistance(texts[0], texts.at(-1), { signal, via: texts.slice(1, -1) })
    return { km: r.km, minutes: r.durationMin, source: 'google' }
  }
  const points = await Promise.all(stops.map((s) => s.point || geocodePlace(s.text, { signal })))
  const missing = points.findIndex((p) => !p)
  if (missing !== -1) return { notFound: missing }
  try {
    return await osrmRoute(points, signal)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    let km = 0
    for (let i = 1; i < points.length; i++) km += straightLineKm(points[i - 1], points[i]) * ROAD_FACTOR
    return { km: Math.max(1, round1(km)), minutes: null, source: 'estimate' }
  }
}
