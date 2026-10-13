import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import CtaBand from '../components/sections/CtaBand.jsx'
import AboutVideo from '../components/sections/AboutVideo.jsx'
import { Section, SectionHeading } from '../components/ui/Section.jsx'
import Photo from '../components/ui/Photo.jsx'
import Reveal from '../components/ui/Reveal.jsx'

export default function About() {
  usePageMeta('about')
  return (
    <>
      <PageHeader eyebrow="About us" title="A collection and delivery business based in Cape Town" />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="space-y-5 text-lg text-muted">
            <p className="text-xl font-medium text-brand-black">
              Terrific Loads collects and delivers furniture, household appliances and other bulky retail purchases.
            </p>
            <p>
              We help customers get big purchases home when they won’t fit in the car, or when the store can’t deliver soon enough. Same-day and next-day collection is available, subject to availability.
            </p>
            <p>
              We collect from stores, showrooms, warehouses and sellers, and deliver directly to the customer.
            </p>
            <p>We keep it simple: we move big things, and we look after them on the way.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <figure>
              <div className="overflow-hidden rounded-3xl">
                <Photo name="team" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/5] w-full object-cover object-top" />
              </div>
              <figcaption className="mt-3 text-sm text-muted">The Terrific Loads team.</figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-surface" aria-labelledby="about-video-heading">
        <SectionHeading
          id="about-video-heading"
          eyebrow="Watch"
          title="See how Terrific Loads works"
          align="center"
        />
        <Reveal className="mt-10">
          <AboutVideo />
        </Reveal>
      </Section>

      <Section aria-label="Our trucks">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal className="overflow-hidden rounded-3xl">
            <Photo name="truck-coast" sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
          <Reveal delay={0.06} className="overflow-hidden rounded-3xl">
            <Photo name="truck-chairs" sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
