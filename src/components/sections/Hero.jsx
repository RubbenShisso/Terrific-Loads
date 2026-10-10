import { ArrowDown, Clock, MapPin } from 'lucide-react'
import { Container } from '../ui/Section.jsx'
import { Button, WhatsAppButton } from '../ui/Button.jsx'
import HeroMedia from './HeroMedia.jsx'
import InteractiveBackdrop from '../ui/InteractiveBackdrop.jsx'
import { business } from '../../config/business.js'

const big = 'sm:min-h-14 sm:px-6 sm:text-lg lg:px-5 lg:text-base xl:px-6 xl:text-lg'

export default function Hero() {
  return (
    <section data-hero className="relative overflow-hidden bg-white">
      <InteractiveBackdrop rest={['20%', '10%']} />
      <Container className="relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-black bg-brand-yellow py-1 pr-3 pl-1 text-sm font-bold text-brand-black">
              <span className="grid size-6 place-items-center rounded-full bg-brand-black text-brand-yellow">
                <Clock className="size-3.5" aria-hidden="true" />
              </span>
              Same-Day &amp; Next-Day Delivery
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-sm font-medium text-brand-black">
              <span className="grid size-6 place-items-center rounded-full bg-brand-yellow">
                <MapPin className="size-3.5" aria-hidden="true" />
              </span>
              {business.serviceArea}
            </p>
          </div>

          <h1 className="mt-5 text-[2.3rem] leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem]">
            Bought Something Too Big for Your Car?
          </h1>

          <p className="mt-5 text-xl font-bold text-brand-black sm:text-2xl">
            We’ll Collect It. <span className="highlight">We’ll Deliver It.</span>
          </p>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Bought furniture, a fridge, washing machine, or another large item? Don’t let transportation hold you back.
            Terrific Loads helps you get bulky purchases from the store to your doorstep, with convenient same-day and
            next-day collection options, subject to availability. We’re a collection and delivery service. We don’t sell furniture.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton magnetic className={big} />
            <Button href="#how-it-works" variant="dark" className={big}>
              How It Works
              <ArrowDown className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <HeroMedia />
      </Container>
      <div className="h-6 lg:h-0" />
    </section>
  )
}
