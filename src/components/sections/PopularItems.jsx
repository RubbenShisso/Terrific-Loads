import { CalendarCheck, Coffee, Refrigerator, Sofa, Utensils, WashingMachine } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { items } from '../../config/items.js'
import { whatsappLink, itemMessage } from '../../config/business.js'
import { useQuickBookProps } from '../booking/BookingProvider.jsx'

// Decorative icons for the popular items in src/config/items.js.
const icons = { couch: Sofa, 'dining-table': Utensils, 'coffee-table': Coffee, fridge: Refrigerator, 'washing-machine': WashingMachine }

function PopularItem({ item }) {
  const Icon = icons[item.id]
  const quickBook = useQuickBookProps({ itemId: item.id })
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-yellow text-brand-black">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold">{item.short}</h3>
      </div>
      <div className="mt-4 grid gap-2">
        <button
          {...quickBook}
          aria-label={`Quick Book a ${item.short.toLowerCase()} delivery`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-black px-3 text-sm font-semibold text-brand-yellow transition hover:bg-ink"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          Quick Book
        </button>
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

/** Popular items, grouped Furniture / Large items. */
export default function PopularItems() {
  const popular = items.filter((i) => i.popular)
  const groups = [
    { title: 'Furniture', list: popular.filter((i) => i.category === 'furniture') },
    { title: 'Large items', list: popular.filter((i) => i.category === 'large') },
  ]
  return (
    <Section id="popular-items" aria-labelledby="popular-title">
      <SectionHeading id="popular-title" eyebrow="Popular items" title="What people book most" intro="Pick an item to Quick Book it, or ask us about it on WhatsApp." />
      <div className="mt-8 space-y-8">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-bold tracking-wider text-muted uppercase">{g.title}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {g.list.map((item, i) => (
                <Reveal as="li" key={item.id} delay={i * 0.05}>
                  <PopularItem item={item} />
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
