import { Container } from '../ui/Section.jsx'
import CountUp from '../ui/CountUp.jsx'
import { storesCollectedFrom } from '../../config/content.js'
import { reviews } from '../../config/reviews.js'
import { rates, formatRand } from '../../config/rates.js'
import { business } from '../../config/business.js'

/**
 * Count-up facts, every number read from the site's own config (never typed in
 * here), so they can't drift from the real prices, stores and reviews.
 */
const stats = [
  { value: rates.maxPricedKm, suffix: ' km', label: 'Standard delivery range' },
  { value: rates.bands[0].price, format: (n) => formatRand(n), prefix: 'From ', label: `Up to ${rates.bands[0].to} km` },
  { value: storesCollectedFrom.length, suffix: '+', label: 'Stores we’ve collected from' },
  ...(reviews.length ? [{ value: business.googleReviewCount, suffix: '+', label: 'Customer reviews on Google' }] : []),
]

export default function StatsStrip() {
  return (
    <section aria-label="Terrific Loads at a glance" className="bg-brand-black text-white">
      <Container>
        <dl className="grid grid-cols-2 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
          {stats.map(({ value, suffix = '', prefix = '', format, label }) => (
            <div key={label} className="flex flex-col-reverse px-4 text-center lg:border-l lg:border-white/15 lg:first:border-l-0">
              <dt className="mt-1 text-sm text-white/70">{label}</dt>
              <dd className="text-3xl font-extrabold text-brand-yellow sm:text-4xl">
                {prefix}
                <CountUp value={value} format={format} />
                {suffix}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
