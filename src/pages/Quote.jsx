import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import QuoteFlow from '../components/quote/QuoteFlow.jsx'
import { Section } from '../components/ui/Section.jsx'

export default function Quote() {
  usePageMeta('quote')
  return (
    <>
      <PageHeader
        eyebrow="Delivery quote"
        title="Get a delivery quote"
        intro="Choose your items, add the addresses and pick a delivery option. We confirm everything with you on WhatsApp."
      />
      <Section className="!pt-10 sm:!pt-14">
        <div className="mx-auto max-w-3xl">
          <QuoteFlow title="Your delivery" />
        </div>
      </Section>
    </>
  )
}
