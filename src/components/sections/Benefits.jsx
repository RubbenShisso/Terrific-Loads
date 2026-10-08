import { Container, IconBadge } from '../ui/Section.jsx'
import Reveal from '../ui/Reveal.jsx'
import { benefits } from '../../config/content.js'

export default function Benefits() {
  return (
    <section aria-label="Why Terrific Loads" className="border-b border-line bg-white">
      <Container className="grid gap-6 py-10 sm:grid-cols-3 sm:py-12">
        {benefits.map(({ icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.06} className="flex items-start gap-4 sm:flex-col lg:flex-row">
            <IconBadge icon={icon} size="lg" />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}
