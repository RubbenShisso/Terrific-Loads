/**
 * Real place and address suggestions for the collection and delivery boxes.
 *
 * Uses Photon (https://photon.komoot.io), a free search-as-you-type service
 * built on OpenStreetMap data. No API key is needed. Set VITE_LOCATION_SEARCH_URL
 * to use a self-hosted Photon instead. Results must credit OpenStreetMap.
 *
 * Only the text typed into the address box is sent, never names or numbers.
 */
import { serviceAreas } from '../config/serviceAreas.js'

const ENDPOINT = import.meta.env.VITE_LOCATION_SEARCH_URL || 'https://photon.komoot.io/api/'
export const LOCATION_ATTRIBUTION = 'Suggestions © OpenStreetMap contributors'

const cache = new Map()
const isWard = (s) => /\bward\s*\d+/i.test(s || '')
const NOISE = new Set(['highway=bus_stop', 'highway=platform', 'public_transport=platform', 'natural=water', 'waterway=river'])

/** Turns one Photon result into { id, primary, secondary, label, place }. */
function toSuggestion(feature, typedNumber) {
  const p = feature.properties || {}
  let primary = p.name || [p.housenumber, p.street].filter(Boolean).join(' ')
  // "12 Long Street" often matches the street without a number: keep the customer's number.
  if (!p.name && !p.housenumber && p.street && typedNumber) primary = `${typedNumber} ${p.street}`
  if (p.osm_key === 'highway' && !p.housenumber && typedNumber && p.name) primary = `${typedNumber} ${p.name}`
  if (!primary) return null

  const area = !isWard(p.district) && p.district ? p.district : p.locality
  const parts = [p.name && p.street && p.street !== p.name ? [p.housenumber, p.street].filter(Boolean).join(' ') : null, area, p.city]
  const seen = new Set([primary.toLowerCase()])
  const secondary = parts.filter((x) => x && !isWard(x) && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase())).join(', ')
  const label = secondary ? `${primary}, ${secondary}` : primary
  return {
    id: `${p.osm_type}${p.osm_id}`,
    primary,
    secondary,
    label,
    // Used by the Quick Book service-area check.
    place: [label, p.state, p.country].filter(Boolean).join(', '),
    lat: feature.geometry?.coordinates?.[1],
    lon: feature.geometry?.coordinates?.[0],
  }
}

/** Suggestions for a typed query (at least 3 characters). Cached per query. */
export async function searchLocations(query, { signal } = {}) {
  const q = query.trim()
  if (q.length < 3) return []
  const key = q.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  const { centre, bbox, limit } = serviceAreas.locationSearch
  const params = new URLSearchParams({ q, limit: String(limit + 4), lang: 'en', lat: String(centre.lat), lon: String(centre.lon), bbox: bbox.join(',') })
  const res = await fetch(`${ENDPOINT}?${params}`, { signal })
  if (!res.ok) throw new Error(`Location search failed (${res.status})`)
  const data = await res.json()

  const typedNumber = q.match(/^\s*(\d+[a-z]?)\s+\S/i)?.[1]
  const out = []
  const labels = new Set()
  for (const f of data.features || []) {
    const p = f.properties || {}
    if (NOISE.has(`${p.osm_key}=${p.osm_value}`)) continue
    const s = toSuggestion(f, typedNumber)
    if (!s || labels.has(s.label.toLowerCase())) continue
    labels.add(s.label.toLowerCase())
    out.push(s)
    if (out.length >= limit) break
  }
  cache.set(key, out)
  return out
}
