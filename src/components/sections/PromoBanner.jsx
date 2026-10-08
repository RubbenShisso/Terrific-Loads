import { Tags } from 'lucide-react'
import { Container } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { WhatsAppButton } from '../ui/Button.jsx'
import { promo } from '../../config/content.js'
import { messages } from '../../config/business.js'

/**
 * Year-round shopping banner (Black Friday, holiday sales, any big promotion).
 * No dates or discounts are hard-coded, so it can stay up all year.
 */
export default function PromoBanner() {
  return (
    <section aria-labelledby="promo-title" className="py-12 sm:py-16">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-brand-yellow px-6 py-10 sm:px-10 sm:py-12">
          {/* Decorative oversized tag, kept out of the way of the text. */}
          <Tags
            aria-hidden="true"
            strokeWidth={1.25}
            className="pointer-events-none absolute -right-6 -bottom-8 size-44 text-brand-black/10 sm:size-56"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-block rounded-md bg-brand-black px-2 py-0.5 text-xs font-bold tracking-wider text-brand-yellow uppercase">
                Shopping the sales?
              </p>
              <h2 id="promo-title" className="mt-3 text-3xl font-extrabold sm:text-4xl">{promo.title}</h2>
              <p className="mt-3 text-lg text-brand-black/85">{promo.text}</p>
            </div>
            <WhatsAppButton label={promo.cta} message={messages.promo} className="shrink-0 shadow-md sm:min-h-14 sm:px-7 sm:text-lg" />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
