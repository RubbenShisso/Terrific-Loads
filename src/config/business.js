/**
 * Single source of truth for Terrific Loads contact details.
 * Phone numbers must only live in this file.
 *
 * confirmWithClient: true means the value came from the client chat or
 * their marketing material and still needs a final sign-off before launch.
 */
export const business = {
  name: 'Terrific Loads',
  tagline: 'Furniture, appliance & bulky-item delivery',
  serviceArea: 'Cape Town & surrounding areas',
  siteUrl: 'https://terrificloads.co.za', // placeholder domain, confirm before launch
  confirmWithClient: true,

  whatsapp: {
    // International format without the plus sign, as wa.me expects.
    number: '27815657009',
    display: '+27 81 565 7009',
    contactName: 'Kiru',
    message: "Hi Terrific Loads, I'd like a delivery quote.",
    confirmWithClient: true,
  },

  // Second contact, taken from the client's business card artwork.
  secondaryContact: {
    name: 'Sura',
    number: '27672941515',
    display: '+27 67 294 1515',
    confirmWithClient: true,
  },

  // Paste the Google Business Profile link here once supplied.
  googleReviewsUrl: 'https://share.google/FTdRDWHXT8YbBDazi',

  // "Where we deliver" chips. DRAFT: broad Cape Town areas only, until the
  // client confirms the exact suburbs they cover.
  serviceAreas: {
    confirmWithClient: true,
    summary: 'Cape Town & surrounding areas',
    chips: ['Cape Town CBD', 'Northern Suburbs', 'Southern Suburbs', 'Atlantic Seaboard', 'Blaauwberg', 'Helderberg'],
  },
}

export const telLink = (number) => `tel:+${number}`

export function whatsappLink(message = business.whatsapp.message, number = business.whatsapp.number) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** Pre-filled WhatsApp messages for specific buttons. */
export const messages = {
  checkItem: "Hi Terrific Loads, I'd like to check if you can collect an item I bought.",
  promo: "Hi Terrific Loads, I found a deal in store and need it delivered. Can you help?",
}

/** WhatsApp message about one item, used by the Popular items cards. */
export const itemMessage = (itemName) => `${business.whatsapp.message}
Item: ${itemName.toLowerCase()}.`

/** WhatsApp message about one service, used by the service cards. */
export const serviceMessage = (serviceTitle) => `${business.whatsapp.message}
Service: ${serviceTitle}.`
