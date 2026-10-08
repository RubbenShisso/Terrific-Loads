import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { Section, SectionHeading, IconBadge } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { services } from '../../config/content.js'
import { whatsappLink, serviceMessage } from '../../config/business.js'

export default function ServicesOverview() {
  const main = services.filter((s) => s.primary)
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What we do"
        title="Furniture, appliances and bulky items, from store to door"
        intro="Bought it, but it won’t fit in your car, or the store can’t deliver soon enough? That’s where we come in."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {main.map(({ id, icon, title, short }, i) => (
          <Reveal as="li" key={id} delay={(i % 4) * 0.06}>
            {/* Lift + yellow border on hover or when anything inside has keyboard focus. */}
            <article className="flex h-full flex-col rounded-2xl border-2 border-line bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg hover:shadow-brand-black/5 has-[:focus-visible]:-translate-y-1 has-[:focus-visible]:border-brand-yellow motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:has-[:focus-visible]:translate-y-0">
              <IconBadge icon={icon} />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-muted">{short}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={whatsappLink(serviceMessage(title))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp about ${title.toLowerCase()}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-brand-black transition hover:brightness-95"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp about this
                </a>
                <Link
                  to={`/services#${id}`}
                  className="group inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand-black underline decoration-brand-yellow decoration-[3px] underline-offset-4"
                >
                  Learn more<span className="sr-only"> about {title.toLowerCase()}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Every collection depends on the item’s size and weight, access at both addresses, space on the truck and availability.
      </p>
    </Section>
  )
}
