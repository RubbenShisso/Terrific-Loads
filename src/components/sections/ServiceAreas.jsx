import { MapPin } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import { business } from '../../config/business.js'
import { QUOTE_EVENTS } from '../../config/quote.js'

/**
 * "Where we deliver" chips from src/config/business.js. Tapping one fills in the
 * quote form's delivery address and scrolls to it. No map.
 */
export default function ServiceAreas() {
  const { summary, chips } = business.serviceAreas
  const pick = (area) => window.dispatchEvent(new CustomEvent(QUOTE_EVENTS.setDelivery, { detail: area }))

  return (
    <Section id="where-we-deliver" aria-labelledby="areas-title" className="border-t border-line">
      <SectionHeading
        id="areas-title"
        eyebrow="Where we deliver"
        title={summary}
        intro="Tap your area to add it to your quote. Not listed? Type it in the calculator or ask us on WhatsApp."
      />
      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Delivery areas">
        {chips.map((area) => (
          <li key={area}>
            <button type="button" className="chip" onClick={() => pick(area)} aria-label={`Use ${area} as the delivery area in the quote form`}>
              <MapPin className="size-4" aria-hidden="true" />
              {area}
            </button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
