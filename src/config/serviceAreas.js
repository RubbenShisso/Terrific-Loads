/**
 * Where address suggestions come from (src/lib/locationSearch.js).
 * Results are limited to this box (Cape Town and surrounds, roughly Atlantis to
 * Hermanus and the Winelands) and ranked by distance from the centre point.
 * Addresses outside it can't be found, so the quote form sends those customers
 * to WhatsApp for a manual quote instead of showing a price.
 */
export const serviceAreas = {
  locationSearch: {
    centre: { lat: -33.9249, lon: 18.4241 }, // Cape Town city centre
    bbox: [17.7, -34.6, 19.9, -32.8], // minLon, minLat, maxLon, maxLat
    limit: 6,
  },
}
