import { Check } from 'lucide-react'
import { Section } from '../ui/Section.jsx'
import Photo from '../ui/Photo.jsx'
import Reveal from '../ui/Reveal.jsx'
import { WhatsAppButton } from '../ui/Button.jsx'

const who = ['Furniture and appliance resellers', 'Furniture stores and showrooms', 'Interior and design businesses', 'Small businesses moving bulky items']

export default function BusinessSection() {
  return (
    <Section id="business" className="border-t border-line">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl">
            <Photo
              name="team-truck-doors"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/3] w-full object-cover object-[50%_35%]"
            />
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <p className="eyebrow">For businesses</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Selling big items? We’ll get them to your customers.</h2>
          <p className="mt-4 text-lg text-muted">
            We help small businesses and resellers deliver furniture, appliances and other bulky items quickly and carefully, so your customers get what they bought without the wait.
          </p>
          <ul className="mt-6 space-y-3">
            {who.map((w) => (
              <li key={w} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-brand-yellow text-brand-black">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {w}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <WhatsAppButton />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
