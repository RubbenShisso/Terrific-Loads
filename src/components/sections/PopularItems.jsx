import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { itemIcons } from '../quote/ItemPicker.jsx'
import { items } from '../../config/items.js'
import { QUOTE_EVENTS } from '../../config/quote.js'
import { whatsappLink, itemMessage } from '../../config/business.js'

function PopularItem({ item }) {
  const Icon = itemIcons[item.id]
  // On a page with the quote form, add the item there; otherwise open the quote page with it.
  const onQuote = (e) => {
    if (!document.getElementById('get-a-quote')) return
    e.preventDefault()
    window.dispatchEvent(new CustomEvent(QUOTE_EVENTS.addItem, { detail: item.id }))
  }
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg hover:shadow-brand-black/5 has-[:focus-visible]:-translate-y-1 has-[:focus-visible]:border-brand-yellow sm:p-5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:has-[:focus-visible]:translate-y-0">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-yellow text-brand-black">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold">{item.label}</h3>
      </div>
      <div className="mt-4 grid gap-2">
        <Link
          to={`/quote?item=${item.id}`}
          onClick={onQuote}
          aria-label={`Get a delivery quote for a ${item.short.toLowerCase()}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-black px-3 text-sm font-semibold text-brand-yellow transition hover:bg-ink"
        >
          <FileText className="size-4" aria-hidden="true" />
          Get a quote
        </Link>
        <a
          href={whatsappLink(itemMessage(item.short))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp us about a ${item.short.toLowerCase()} delivery`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 text-sm font-semibold text-brand-black transition hover:brightness-95"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
      </div>
    </article>
  )
}

/** The client's common items, each a shortcut into the quote form. */
export default function PopularItems() {
  const popular = items.filter((i) => i.popular)
  return (
    <Section id="popular-items" aria-labelledby="popular-title">
      <SectionHeading id="popular-title" eyebrow="Popular items" title="What people get delivered most" intro="Pick an item to start a quote, or ask us about it on WhatsApp." />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {popular.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 0.05}>
            <PopularItem item={item} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
