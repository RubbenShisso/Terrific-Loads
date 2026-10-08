import { Container } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import InteractiveBackdrop from '../ui/InteractiveBackdrop.jsx'
import { WhatsAppButton, QuoteButton } from '../ui/Button.jsx'

/** The one large dark section on a page (besides the footer). */
export default function CtaBand({
  title = 'Bought it. It’s ready. Let’s get it home.',
  text = 'Send us the collection address, delivery address and what needs moving. We’ll reply with a quote.',
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-brand-black px-6 py-12 text-center sm:px-12 sm:py-16">
          <InteractiveBackdrop tone="dark" rest={['50%', '110%']} />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-brand-yellow" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/80">{text}</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton magnetic />
            <QuoteButton variant="yellow" />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
