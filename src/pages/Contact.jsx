import { MapPin, Phone } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import { Section, IconBadge } from '../components/ui/Section.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import WhatsAppIcon from '../components/ui/WhatsAppIcon.jsx'
import { WhatsAppButton, QuoteButton } from '../components/ui/Button.jsx'
import { business, whatsappLink, telLink } from '../config/business.js'

function ContactCard({ name, display, number, primary }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 transition hover:border-brand-black">
      <p className="eyebrow">{primary ? 'WhatsApp & call' : 'Call or WhatsApp'}</p>
      <p className="mt-3 text-2xl font-bold text-brand-black">{name}</p>
      <p className="mt-1 text-lg text-muted">{display}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsappLink(undefined, number)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 font-semibold text-brand-black hover:brightness-95"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp {name}
        </a>
        <a
          href={telLink(number)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 font-semibold text-brand-black hover:border-brand-black"
        >
          <Phone className="size-5" aria-hidden="true" />
          Call
        </a>
      </div>
    </div>
  )
}

export default function Contact() {
  usePageMeta('contact')
  const { whatsapp, secondaryContact } = business
  return (
    <>
      <PageHeader eyebrow="Contact" title="Terrific Loads" intro="Furniture, appliance and bulky-item collection and delivery. WhatsApp is the quickest way to reach us.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton />
          <QuoteButton />
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <ContactCard primary name={whatsapp.contactName} display={whatsapp.display} number={whatsapp.number} />
          </Reveal>
          <Reveal delay={0.06}>
            <ContactCard name={secondaryContact.name} display={secondaryContact.display} number={secondaryContact.number} />
          </Reveal>
        </div>

        <Reveal className="mt-4 flex items-start gap-4 rounded-2xl border border-line bg-surface p-6">
          <IconBadge icon={MapPin} size="lg" />
          <div>
            <h2 className="text-xl font-bold">Service area</h2>
            <p className="mt-1 text-muted">
              {business.serviceArea}. We’re a mobile delivery service, so we come to you. There’s no storefront to visit.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
