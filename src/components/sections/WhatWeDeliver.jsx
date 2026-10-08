import { Section, SectionHeading } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { WhatsAppButton } from '../ui/Button.jsx'
import { deliverables } from '../../config/content.js'
import { messages } from '../../config/business.js'

/** "If it won't fit in your car, talk to us": item categories as icon tiles. */
export default function WhatWeDeliver() {
  return (
    <Section id="what-we-deliver" className="bg-surface" aria-labelledby="deliver-title">
      <SectionHeading
        id="deliver-title"
        eyebrow="What can we deliver?"
        title="If It Won’t Fit in Your Car, Talk to Us."
        intro="We collect furniture, household appliances and other bulky purchases from retail stores and deliver them to you."
      />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {deliverables.map(({ icon: Icon, label }, i) => (
          <Reveal as="li" key={label} delay={(i % 4) * 0.05}>
            <div className="group flex h-full flex-col items-start gap-4 rounded-2xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-black sm:p-6 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-yellow text-brand-black transition-transform duration-200 group-hover:scale-105 sm:size-14 motion-reduce:transition-none">
                <Icon className="size-6 sm:size-7" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="font-semibold text-brand-black sm:text-lg">{label}</span>
            </div>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-lg font-bold text-brand-black">Not sure if we can collect it?</p>
          <p className="mt-1 text-sm text-muted">
            Send us the item and its size. It depends on dimensions, weight, access and space on the truck.
          </p>
        </div>
        <WhatsAppButton label="Ask Us on WhatsApp" message={messages.checkItem} className="shrink-0" />
      </div>
    </Section>
  )
}
