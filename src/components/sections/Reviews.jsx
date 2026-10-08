import { useEffect, useRef, useState } from 'react'
import { Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import { reviews } from '../../config/reviews.js'
import { business } from '../../config/business.js'

// Development-only stand-ins so the carousel can be checked before the client's
// real reviews arrive. Never rendered in production.
const devPlaceholders = [1, 2, 3].map((n) => ({
  placeholder: true,
  name: `Placeholder ${n}`,
  rating: 5,
  text: `Paste Google review ${n} here, word for word, in src/config/reviews.js.`,
}))

/**
 * Real Google reviews in a scroll-snap row: swipe on mobile, arrows and dots
 * on desktop. Production: hidden when there are no reviews and no Google link.
 */
export default function Reviews() {
  const list = reviews.length ? reviews : import.meta.env.DEV ? devPlaceholders : []
  const link = business.googleReviewsUrl
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  // Snap positions the row can actually reach. With two cards in view, three
  // reviews give two positions, so the dots and arrows match what scrolls.
  const [stops, setStops] = useState([0])
  const scrollable = stops.length > 1

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = [...track.children]
    let positions = [0]
    const onScroll = () => {
      let best = 0
      positions.forEach((p, i) => { if (Math.abs(p - track.scrollLeft) < Math.abs(positions[best] - track.scrollLeft)) best = i })
      setActive(best)
    }
    const measure = () => {
      const max = track.scrollWidth - track.clientWidth
      const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
      const base = track.getBoundingClientRect().left - track.scrollLeft
      positions = [...new Set(cards.map((c) => Math.round(Math.min(Math.max(c.getBoundingClientRect().left - base - pad, 0), max))))]
      setStops(positions)
      onScroll()
    }
    measure()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => { track.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure) }
  }, [list.length])

  if (!list.length && !link) return null

  const goTo = (i) => {
    const left = stops[Math.max(0, Math.min(stops.length - 1, i))]
    trackRef.current?.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const arrow = 'grid size-11 place-items-center rounded-full border border-line bg-white text-brand-black transition hover:border-brand-black disabled:opacity-40'

  return (
    <Section id="reviews" className="bg-surface" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="reviews-title" eyebrow="Google reviews" title="What our customers say" />
        {scrollable && (
          <div className="hidden gap-2 md:flex">
            <button type="button" className={arrow} onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous review">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" className={arrow} onClick={() => goTo(active + 1)} disabled={active === stops.length - 1} aria-label="Next review">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {list.length > 0 && (
        <>
          <ul
            ref={trackRef}
            tabIndex={0}
            aria-label="Customer reviews, scroll sideways for more"
            className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {list.map((r, i) => (
              <li
                key={r.name + i}
                aria-label={`Review ${i + 1} of ${list.length}`}
                className={`flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border bg-white p-6 sm:w-[60%] md:w-[calc(50%-0.5rem)] ${r.placeholder ? 'border-2 border-dashed border-brand-black/30' : 'border-line'}`}
              >
                <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} strokeWidth={1.5} className={`size-5 text-brand-black ${s < r.rating ? 'fill-brand-yellow' : 'fill-transparent opacity-30'}`} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-ink">“{r.text}”</blockquote>
                <p className="mt-5 text-sm">
                  <span className="font-semibold text-brand-black">{r.name}</span>
                  {r.date && <span className="text-muted"> · {r.date}</span>}
                </p>
              </li>
            ))}
          </ul>

          {scrollable && (
            <div className="mt-4 hidden justify-center gap-1 md:flex" role="group" aria-label="Choose a review">
              {stops.map((stop, i) => (
                <button
                  key={stop}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show review ${i + 1}`}
                  aria-current={active === i ? 'true' : undefined}
                  className="grid size-11 place-items-center"
                >
                  <span className={`block h-2.5 rounded-full transition-all ${active === i ? 'w-6 bg-brand-black' : 'w-2.5 bg-brand-black/25'}`} />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-link mt-8 inline-flex items-center gap-2">
          Read all our reviews on Google
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      )}
    </Section>
  )
}
