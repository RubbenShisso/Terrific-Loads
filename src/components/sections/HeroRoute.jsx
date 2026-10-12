import { Store, House, Truck } from 'lucide-react'

/**
 * A little animated route for the hero: a dashed line draws from the store to
 * the customer's door while a truck drives along it. Pure CSS (see .hero-route
 * in index.css); with reduced motion it simply shows the finished route.
 */
export default function HeroRoute() {
  return (
    <div
      className="hero-route mt-8 flex items-center gap-3 text-sm font-semibold text-brand-black"
      role="img"
      aria-label="Collected from the store, delivered to your door"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-brand-black bg-white">
        <Store className="size-5" aria-hidden="true" />
      </span>
      <span className="relative h-10 max-w-xs min-w-0 flex-1" aria-hidden="true">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <path d="M0 20 C 40 2, 70 38, 100 20 S 160 2, 200 20" className="hero-route-line" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="hero-route-truck absolute top-1/2 left-0 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-brand-yellow shadow">
          <Truck className="size-4" />
        </span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-black text-brand-yellow">
        <House className="size-5" aria-hidden="true" />
      </span>
      <span className="hidden sm:inline">Store to your door</span>
    </div>
  )
}
