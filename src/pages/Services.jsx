import usePageMeta from '../hooks/usePageMeta.js'
import PageHeader from '../components/sections/PageHeader.jsx'
import CtaBand from '../components/sections/CtaBand.jsx'
import PromoBanner from '../components/sections/PromoBanner.jsx'
import { Container, IconBadge } from '../components/ui/Section.jsx'
import Photo from '../components/ui/Photo.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import WhatsAppIcon from '../components/ui/WhatsAppIcon.jsx'
import { WhatsAppButton, QuoteButton } from '../components/ui/Button.jsx'
import { services } from '../config/content.js'
import { whatsappLink, serviceMessage } from '../config/business.js'

function ServiceDetail({ service, index }) {
  const { id, icon, title, body, photo } = service
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-24 items-center gap-8 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <Reveal className={index % 2 ? 'lg:order-2' : ''}>
        <div className="overflow-hidden rounded-3xl">
          <Photo name={photo} sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3] w-full object-cover" />
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <IconBadge icon={icon} size="lg" />
        <h2 id={`${id}-title`} className="mt-5 text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-4 text-lg text-muted">{body}</p>
        <a
          href={whatsappLink(serviceMessage(title))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-brand-black transition hover:brightness-95"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp about {title.toLowerCase()}
        </a>
      </Reveal>
    </section>
  )
}

export default function Services() {
  usePageMeta('services')
  const main = services.filter((s) => s.primary)
  const more = services.filter((s) => !s.primary)
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Furniture, appliance and bulky-item delivery"
        intro="Bought something too big for your car, or the store can’t deliver soon enough? We collect it from the store and deliver it to you."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton />
          <QuoteButton label="Get a Delivery Quote" />
        </div>
      </PageHeader>

      <Container className="divide-y divide-line">
        {main.map((s, i) => <ServiceDetail key={s.id} service={s} index={i} />)}
      </Container>

      <Container>
        <p className="mt-6 rounded-2xl border border-line bg-surface p-5 text-muted">
          Every collection depends on the item’s size and weight, access at the collection and delivery addresses,
          space on the truck and availability. Not sure? Send us the item details on WhatsApp first.
        </p>
        <h2 className="mt-16 text-2xl font-bold sm:text-3xl">More ways we help</h2>
      </Container>
      <Container className="divide-y divide-line">
        {more.map((s, i) => <ServiceDetail key={s.id} service={s} index={i + main.length} />)}
      </Container>

      <PromoBanner />
      <CtaBand title="Need something collected and delivered?" />
    </>
  )
}
