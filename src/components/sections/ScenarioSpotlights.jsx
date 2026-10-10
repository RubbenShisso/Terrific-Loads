import { FileText, House, ShoppingBag, Car } from 'lucide-react'
import { Section, IconBadge } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { Button } from '../ui/Button.jsx'

const spotlights = [
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Bought something on Facebook Marketplace?',
    text: 'We can collect it from the seller and deliver it directly to you.',
  },
  {
    id: 'property',
    icon: House,
    title: 'Need something moved from one property to another?',
    text: 'Furniture or a large item between homes, flats or offices, collected and delivered.',
  },
  {
    id: 'too-big',
    icon: Car,
    title: 'Bought something that won’t fit in your car?',
    text: 'Tell us what it is and where it’s going. We’ll collect it from the store.',
  },
]

function Spotlight({ s, index }) {
  return (
    <Reveal as="article" delay={index * 0.06} className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 sm:p-7">
      <IconBadge icon={s.icon} size="lg" />
      <h2 className="mt-5 text-xl font-bold sm:text-2xl">{s.title}</h2>
      <p className="mt-2 flex-1 text-muted">{s.text}</p>
      <Button href="#get-a-quote" variant="dark" className="mt-6 w-full !whitespace-normal text-center sm:w-auto sm:self-start">
        <FileText className="size-5" aria-hidden="true" />
        Get a delivery quote
      </Button>
    </Reveal>
  )
}

/** Marketplace, property-to-property and too-big-for-your-car, each pointing to the quote form. */
export default function ScenarioSpotlights() {
  return (
    <Section id="more-ways" aria-label="More ways we help" className="bg-surface">
      <div className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        {spotlights.map((s, i) => (
          <Spotlight key={s.id} s={s} index={i} />
        ))}
      </div>
    </Section>
  )
}
