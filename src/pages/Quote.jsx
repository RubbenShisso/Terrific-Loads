import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import QuoteForm from '../components/forms/QuoteForm.jsx'
import QuoteCalculator from '../components/quote/QuoteCalculator.jsx'
import { Container, Section } from '../components/ui/Section.jsx'

export default function Quote() {
  usePageMeta('quote')
  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Get a delivery quote"
        intro="Furniture, appliances or another bulky item? Estimate it in seconds and send it on WhatsApp, or fill in the form below."
      />
      <Container className="pt-10 sm:pt-14">
        <QuoteCalculator quoteHref="#quote-form" />
      </Container>
      <Section className="!pt-12 sm:!pt-16">
        <div id="quote-form" className="mx-auto max-w-3xl scroll-mt-24">
          <h2 className="text-2xl font-bold sm:text-3xl">Request a delivery quote</h2>
          <p className="mt-2 text-muted">
            Fill in the details below and we’ll open WhatsApp with everything ready to send. We reply with a quote and confirm availability.
          </p>
          <div className="mt-6 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
            <QuoteForm />
          </div>
        </div>
      </Section>
    </>
  )
}
