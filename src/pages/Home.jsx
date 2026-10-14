import usePageMeta from '../hooks/usePageMeta.js'
import Hero from '../components/sections/Hero.jsx'
import Benefits from '../components/sections/Benefits.jsx'
import StatsStrip from '../components/sections/StatsStrip.jsx'
import ServicesOverview from '../components/sections/ServicesOverview.jsx'
import Gallery from '../components/sections/Gallery.jsx'
import HowItWorks from '../components/sections/HowItWorks.jsx'
import Reviews from '../components/sections/Reviews.jsx'
import BusinessSection from '../components/sections/BusinessSection.jsx'
import Faq from '../components/sections/Faq.jsx'
import CtaBand from '../components/sections/CtaBand.jsx'
import ServiceAreas from '../components/sections/ServiceAreas.jsx'
import WhatWeDeliver from '../components/sections/WhatWeDeliver.jsx'
import StoresCollectedFrom, { StoresStrip } from '../components/sections/StoresCollectedFrom.jsx'
import PromoBanner from '../components/sections/PromoBanner.jsx'
import PopularItems from '../components/sections/PopularItems.jsx'
import ScenarioSpotlights from '../components/sections/ScenarioSpotlights.jsx'
import QuoteFlow from '../components/quote/QuoteFlow.jsx'
import { Section } from '../components/ui/Section.jsx'

export default function Home() {
  usePageMeta('home')
  return (
    <>
      <StoresStrip />
      <Hero />
      <Section className="border-t border-line bg-surface !py-10 sm:!py-14">
        <div className="mx-auto max-w-3xl">
          <QuoteFlow />
        </div>
      </Section>
      <Benefits />
      <StatsStrip />
      <ServicesOverview />
      <WhatWeDeliver />
      <PopularItems />
      <ScenarioSpotlights />
      <Gallery />
      <StoresCollectedFrom />
      <HowItWorks />
      <PromoBanner />
      <Reviews />
      <BusinessSection />
      <ServiceAreas />
      <Faq />
      <CtaBand />
    </>
  )
}
