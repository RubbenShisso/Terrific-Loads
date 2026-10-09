import { CalendarCheck } from 'lucide-react'
import { Section, IconBadge } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { Button } from '../ui/Button.jsx'
import { scenarioById } from '../../config/scenarios.js'
import { useQuickBookProps } from '../booking/BookingProvider.jsx'

const spotlights = [
  {
    scenario: 'marketplace',
    title: 'Bought something on Facebook Marketplace?',
    text: 'We can collect it from the seller and deliver it directly to you.',
    cta: 'Quick Book Marketplace Delivery',
  },
  {
    scenario: 'property',
    title: 'Need something moved from one property to another?',
    text: 'Furniture or a large item between homes, flats or offices, collected and delivered.',
    cta: 'Quick Book',
  },
  {
    scenario: 'too-big',
    title: 'Bought something that won’t fit in your car?',
    text: 'Tell us what it is and where it’s going. We’ll collect it from the store.',
    cta: 'Get It Collected',
  },
]

function Spotlight({ s, index }) {
  const props = useQuickBookProps({ scenario: s.scenario })
  const { icon } = scenarioById[s.scenario]
  return (
    <Reveal as="article" delay={index * 0.06} className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 sm:p-7">
      <IconBadge icon={icon} size="lg" />
      <h2 className="mt-5 text-xl font-bold sm:text-2xl">{s.title}</h2>
      <p className="mt-2 flex-1 text-muted">{s.text}</p>
      <Button variant="dark" className="mt-6 w-full !whitespace-normal text-center sm:w-auto sm:self-start" {...props}>
        <CalendarCheck className="size-5" aria-hidden="true" />
        {s.cta}
      </Button>
    </Reveal>
  )
}

/** Marketplace, property-to-property and too-big-for-your-car, each opening Quick Book. */
export default function ScenarioSpotlights() {
  return (
    <Section id="more-ways" aria-label="More ways to Quick Book" className="bg-surface">
      <div className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        {spotlights.map((s, i) => (
          <Spotlight key={s.scenario} s={s} index={i} />
        ))}
      </div>
    </Section>
  )
}
