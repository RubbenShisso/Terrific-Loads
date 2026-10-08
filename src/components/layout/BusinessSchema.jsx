import { business } from '../../config/business.js'
import { services } from '../../config/content.js'

/**
 * LocalBusiness structured data built from config (service-area business,
 * no street address, no prices, no opening hours, no partner claims).
 */
export default function BusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description:
      'Collection and delivery of furniture, household appliances and other bulky retail purchases that won’t fit in your car, with same-day and next-day options subject to availability.',
    url: business.siteUrl,
    telephone: business.whatsapp.display,
    image: `${business.siteUrl}/og-image.jpg`,
    areaServed: { '@type': 'City', name: 'Cape Town' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Collection and delivery services',
      itemListElement: services
        .filter((s) => s.primary)
        .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.short } })),
    },
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
