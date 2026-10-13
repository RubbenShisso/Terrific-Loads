import { business } from '../../config/business.js'
import { services } from '../../config/content.js'

/**
 * LocalBusiness + WebSite structured data built from config (service-area
 * business, no street address, no prices, no opening hours, no partner claims).
 */
export default function BusinessSchema() {
  const site = business.siteUrl
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${site}/#business`,
        name: business.name,
        description:
          'Collection and delivery of furniture, household appliances and other bulky retail purchases that won’t fit in your car, with same-day and next-day options subject to availability.',
        url: `${site}/`,
        telephone: `+${business.whatsapp.number}`,
        image: `${site}/og-image.jpg`,
        logo: `${site}/icon-512.png`,
        areaServed: [
          { '@type': 'City', name: 'Cape Town' },
          ...business.serviceAreas.chips.map((name) => ({ '@type': 'Place', name: `${name}, Cape Town` })),
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Collection and delivery services',
          itemListElement: services
            .filter((s) => s.primary)
            .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.short } })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        name: business.name,
        url: `${site}/`,
        inLanguage: 'en-ZA',
        publisher: { '@id': `${site}/#business` },
      },
    ],
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
