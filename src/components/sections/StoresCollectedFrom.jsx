import { Store } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import { storesCollectedFrom } from '../../config/content.js'

/**
 * Retailers the team has collected customers' purchases from, as plain text.
 * Not a partners list: no logos (permission not confirmed) and a disclaimer.
 */
export default function StoresCollectedFrom() {
  return (
    <Section id="stores" aria-labelledby="stores-title" className="bg-surface">
      <SectionHeading
        id="stores-title"
        eyebrow="Store collections"
        title="Stores We’ve Collected From"
        intro="Customers have asked us to collect their purchases from stores including:"
      />
      <ul className="mt-8 flex flex-wrap gap-2 sm:gap-3">
        {storesCollectedFrom.map((name) => (
          <li
            key={name}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold tracking-wide text-brand-black sm:text-base"
          >
            <Store className="size-4 text-muted" aria-hidden="true" />
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-2xl text-xs text-muted sm:text-sm">
        Terrific Loads is an independent collection and delivery service. References to retailers do not imply
        affiliation, partnership, or endorsement.
      </p>
    </Section>
  )
}
