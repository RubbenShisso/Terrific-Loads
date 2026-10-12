import { Container, SectionHeading } from '../ui/Section.jsx'
import { storesCollectedFrom } from '../../config/content.js'

/**
 * Retailers the team has collected customers' purchases from, as a looping logo
 * banner that pauses on hover. Not a partners list: it carries a disclaimer.
 */
function LogoSet({ hidden }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {storesCollectedFrom.map(({ name, logo }) => (
        <li key={name} className="h-10 w-36 shrink-0 px-6 sm:h-12 sm:w-44">
          <img
            src={`/images/stores/${logo}.webp`}
            alt={hidden ? '' : name}
            loading="lazy"
            decoding="async"
            className="size-full object-contain opacity-80 transition-opacity hover:opacity-100"
          />
        </li>
      ))}
    </ul>
  )
}

/** The looping banner on its own (full page width), for use under the hero. */
export function LogoBanner({ className = '' }) {
  return (
    <div className={`logo-marquee overflow-hidden bg-brand-black py-6 motion-reduce:overflow-x-auto ${className}`}>
      <div className="logo-marquee-track flex w-max">
        <LogoSet />
        <LogoSet hidden />
      </div>
    </div>
  )
}

/** Slim strip directly under the hero. */
export function StoresStrip() {
  return (
    <section aria-label="Stores we’ve collected from" className="bg-brand-black">
      <p className="px-4 pt-4 text-center text-xs font-semibold tracking-wide text-white/70 uppercase">Stores we’ve collected from</p>
      <LogoBanner className="!py-4" />
      <p className="px-4 pb-4 text-center text-[11px] text-white/50">
        Independent collection and delivery service. No affiliation, partnership or endorsement implied.
      </p>
    </section>
  )
}

export default function StoresCollectedFrom() {
  return (
    <section id="stores" aria-labelledby="stores-title" className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          id="stores-title"
          eyebrow="Store collections"
          title="Stores We’ve Collected From"
          intro="Customers have asked us to collect their purchases from stores including:"
        />
      </Container>
      {/* Full page width: sits outside the Container. */}
      <LogoBanner className="mt-8" />
      <Container>
        <p className="mt-6 max-w-2xl text-xs text-muted sm:text-sm">
          Terrific Loads is an independent collection and delivery service. References to retailers do not imply
          affiliation, partnership, or endorsement.
        </p>
      </Container>
    </section>
  )
}
