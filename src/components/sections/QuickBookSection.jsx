import { Section, SectionHeading } from '../ui/Section.jsx'
import { ScenarioCards } from '../booking/ScenarioSelector.jsx'

/** "Store can't deliver it today?" Quick Book entry point. */
export default function QuickBookSection() {
  return (
    <Section id="quick-book" aria-labelledby="quick-book-title" className="border-t border-line">
      <SectionHeading
        id="quick-book-title"
        eyebrow="Quick Book"
        title="Store can’t deliver it today?"
        intro="Let us know what you bought and where it needs to go. We can collect it for you."
      />
      <p className="mt-6 font-semibold text-brand-black">What do you need help with?</p>
      <div className="mt-3">
        <ScenarioCards />
      </div>
      <p className="mt-4 text-sm text-muted">Quick Book is for today and tomorrow. Get an estimate in a few steps, then book or continue on WhatsApp.</p>
    </Section>
  )
}
