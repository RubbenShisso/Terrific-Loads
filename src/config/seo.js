/**
 * Page titles and descriptions. Used by usePageMeta in the browser and by
 * scripts/prerender.mjs when it writes each page's static HTML.
 */
export const SITE_TITLE = 'Terrific Loads | Furniture, Appliance & Bulky Item Delivery'

export const pages = {
  home: {
    path: '/',
    title: null,
    description:
      'Bought furniture, appliances or bulky items that won’t fit in your car? Terrific Loads offers convenient retail collection and delivery services. Request a quote today.',
  },
  about: {
    path: '/about',
    title: 'About us',
    description: 'Terrific Loads is a Cape Town collection and delivery business for furniture, household appliances and other bulky retail purchases.',
  },
  services: {
    path: '/services',
    title: 'Services',
    description:
      'Furniture delivery, appliance delivery (fridges, washing machines, dishwashers), bulky item collection and same-day store collection in Cape Town and surrounding areas.',
  },
  quote: {
    path: '/quote',
    title: 'Request a quote',
    description: 'Estimate your delivery and request a quote for furniture, appliances or other bulky items. Tell us where to collect, where to deliver and what needs moving.',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description: 'WhatsApp or call Terrific Loads for furniture, appliance and bulky-item collection and delivery in Cape Town and surrounding areas.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    description: 'How Terrific Loads collects and uses personal information, in line with POPIA.',
  },
  notFound: {
    path: '*',
    title: 'Page not found',
    description: 'This page doesn’t exist. Terrific Loads: furniture, appliance and bulky-item delivery in Cape Town.',
  },
}

export const fullTitle = (title) => (title ? `${title} | Terrific Loads` : SITE_TITLE)
export const knownPaths = Object.values(pages).map((p) => p.path).filter((p) => p !== '*')
