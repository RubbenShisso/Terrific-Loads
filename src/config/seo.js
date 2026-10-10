/**
 * Page titles and descriptions. Used by usePageMeta in the browser and by
 * scripts/prerender.mjs when it writes each page's static HTML, sitemap.xml
 * and robots.txt. Add a page here and it is picked up everywhere.
 */
import { business } from './business.js'

export const SITE_TITLE = 'Terrific Loads | Furniture, Appliance & Bulky Item Delivery'

/** Absolute site address with no trailing slash (business.siteUrl). */
export const SITE_URL = business.siteUrl.replace(/\/+$/, '')

export const OG_IMAGE = {
  path: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Terrific Loads: furniture, appliance and bulky-item collection and delivery in Cape Town',
}

/**
 * index: false keeps a page out of sitemap.xml and adds noindex.
 * changefreq / priority are hints for sitemap.xml only.
 */
export const pages = {
  home: {
    path: '/',
    title: null,
    description:
      'Bought furniture, appliances or bulky items that won’t fit in your car? Terrific Loads offers same-day and next-day retail collection and delivery. Request a quote today.',
    changefreq: 'weekly',
    priority: '1.0',
  },
  services: {
    path: '/services',
    title: 'Services',
    description:
      'Furniture delivery, appliance delivery (fridges, washing machines, dishwashers), bulky item collection, and same-day and next-day delivery in Cape Town and surrounding areas.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  quote: {
    path: '/quote',
    title: 'Request a quote',
    description: 'Estimate your delivery and request a quote for furniture, appliances or other bulky items. Tell us where to collect, where to deliver and what needs moving.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  about: {
    path: '/about',
    title: 'About us',
    description: 'Terrific Loads is a Cape Town collection and delivery business for furniture, household appliances and other bulky retail purchases.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description: 'WhatsApp or call Terrific Loads for furniture, appliance and bulky-item collection and delivery in Cape Town and surrounding areas.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  sitemap: {
    path: '/sitemap',
    title: 'Sitemap',
    description: 'Every page and section on the Terrific Loads website: services, delivery quotes, delivery areas, FAQs, contact details and our privacy policy.',
    changefreq: 'monthly',
    priority: '0.3',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    description: 'How Terrific Loads collects and uses personal information, in line with POPIA.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  notFound: {
    path: '*',
    title: 'Page not found',
    description: 'This page doesn’t exist. Terrific Loads: furniture, appliance and bulky-item delivery in Cape Town.',
    index: false,
  },
}

export const fullTitle = (title) => (title ? `${title} | Terrific Loads` : SITE_TITLE)
export const knownPaths = Object.values(pages).map((p) => p.path).filter((p) => p !== '*')

/** Canonical address of a page, e.g. https://terrificloads.co.za/services. Home keeps its slash. */
export const canonicalUrl = (path) => `${SITE_URL}${path === '/' ? '/' : path}`
export const absoluteUrl = (path) => `${SITE_URL}${path}`
export const isIndexable = (page) => page.index !== false && page.path !== '*'
