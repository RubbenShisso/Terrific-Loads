import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import { Section } from '../components/ui/Section.jsx'
import { pages, isIndexable } from '../config/seo.js'
import { services, faqs } from '../config/content.js'

/** Sections of the home page that can be linked to directly. */
const homeSections = [
  { hash: 'get-a-quote', label: 'Get a delivery quote' },
  { hash: 'services', label: 'What we do' },
  { hash: 'what-we-deliver', label: 'What we deliver' },
  { hash: 'popular-items', label: 'Popular items' },
  { hash: 'more-ways', label: 'Marketplace, moves and too-big-for-your-car' },
  { hash: 'our-work', label: 'Our work' },
  { hash: 'stores', label: 'Stores we’ve collected from' },
  { hash: 'how-it-works', label: 'How it works' },
  { hash: 'business', label: 'For businesses and resellers' },
  { hash: 'where-we-deliver', label: 'Where we deliver' },
  { hash: 'faq', label: 'Frequently asked questions' },
]

const pageLabel = { home: 'Home', services: 'Services', quote: 'Request a quote', about: 'About us', contact: 'Contact', sitemap: 'Sitemap', privacy: 'Privacy policy' }

const linkCls = 'inline-flex min-h-11 items-center font-semibold text-brand-black underline decoration-brand-yellow decoration-2 underline-offset-4 transition-colors hover:decoration-brand-black'
const subCls = 'inline-flex min-h-10 items-center text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-brand-black'

/** Sub-links shown under a page, if any. */
const children = {
  home: homeSections.map((s) => ({ to: `/#${s.hash}`, label: s.label })),
  services: services.map((s) => ({ to: `/services#${s.id}`, label: s.title })),
}

export default function Sitemap() {
  usePageMeta('sitemap')
  const list = Object.entries(pages).filter(([key, page]) => isIndexable(page) && key !== 'sitemap')
  return (
    <>
      <PageHeader eyebrow="Sitemap" title="Everything on this site" intro="Every page and section in one place." />
      <Section>
        <ul className="grid max-w-4xl gap-x-12 gap-y-10 md:grid-cols-2">
          {list.map(([key, page]) => (
            <li key={key}>
              <h2 className="text-xl font-bold">
                <Link to={page.path} className={linkCls}>{pageLabel[key] || page.title}</Link>
              </h2>
              <p className="mt-1 text-muted">{page.description}</p>
              {children[key] && (
                <ul className="mt-2" aria-label={`${pageLabel[key]} sections`}>
                  {children[key].map((c) => (
                    <li key={c.to}>
                      <Link to={c.to} className={subCls}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="md:col-span-2">
            <h2 className="text-xl font-bold">
              <Link to="/#faq" className={linkCls}>Questions</Link>
            </h2>
            <ul className="mt-3 grid gap-x-12 md:grid-cols-2" aria-label="Frequently asked questions">
              {faqs.map((f) => (
                <li key={f.id}>
                  <Link to={`/#faq-${f.id}`} className={subCls}>{f.q}</Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </Section>
    </>
  )
}
