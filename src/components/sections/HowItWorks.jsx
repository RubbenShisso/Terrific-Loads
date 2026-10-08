import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Truck } from 'lucide-react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { Section, SectionHeading } from '../ui/Section.jsx'
import { WhatsAppButton } from '../ui/Button.jsx'
import { steps } from '../../config/content.js'

/**
 * Four steps joined by a line that fills yellow as you scroll through the
 * section: vertical on mobile, horizontal on desktop. Each step lights up as
 * it enters view, and a small truck drives along the line with you (transform
 * only, so no layout shift). With reduced motion the line is simply full and
 * the truck is left out.
 */
export default function HowItWorks() {
  const listRef = useRef(null)
  const reduce = useReducedMotionSafe()
  const [reached, setReached] = useState(() => steps.map(() => false))
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 60%'] })

  useEffect(() => {
    const els = [...listRef.current.querySelectorAll('[data-step]')]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.step)
            setReached((r) => (r[i] ? r : r.map((v, k) => (k === i ? true : v))))
          }
        })
      },
      { rootMargin: '0px 0px -25% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const fill = reduce ? { scaleX: 1, scaleY: 1 } : undefined
  // The truck's carrier is as long as the track, so 0–100% of its own size = start to end.
  const along = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const truckBadge = (rotate) => (
    <span className="grid size-11 place-items-center rounded-full border-2 border-brand-black bg-brand-yellow text-brand-black shadow-md">
      <Truck className={`size-5 ${rotate}`} aria-hidden="true" />
    </span>
  )

  return (
    <Section id="how-it-works">
      <SectionHeading eyebrow="How it works" title="From the store to your door in four steps" />
      <div className="relative mt-10">
        {/* Track + fill: vertical (mobile) */}
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[1.375rem] w-1 rounded-full bg-line lg:hidden">
          <motion.div style={fill ?? { scaleY: scrollYProgress }} className="size-full origin-top rounded-full bg-brand-yellow" />
        </div>
        {/* Track + fill: horizontal (desktop) */}
        <div aria-hidden="true" className="absolute top-[1.375rem] right-[12.5%] left-[12.5%] hidden h-1 rounded-full bg-line lg:block">
          <motion.div style={fill ?? { scaleX: scrollYProgress }} className="size-full origin-left rounded-full bg-brand-yellow" />
        </div>

        {!reduce && (
          <>
            {/* Truck: vertical (mobile). Clipped so it never adds scroll overflow; sits behind the step numbers. */}
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-[1.375rem] z-[5] w-1 lg:hidden">
              <div className="absolute -inset-x-5 -inset-y-[1.375rem] overflow-hidden">
                <motion.div style={{ y: along }} className="absolute top-0 left-0 h-[calc(100%-2.75rem)] w-full">
                  {truckBadge('')}
                </motion.div>
              </div>
            </div>
            {/* Truck: horizontal (desktop) */}
            <div aria-hidden="true" className="absolute top-[1.375rem] right-[12.5%] left-[12.5%] z-[5] hidden h-1 lg:block">
              <div className="absolute -inset-x-[1.375rem] -inset-y-5 overflow-hidden">
                <motion.div style={{ x: along }} className="absolute top-0 left-0 h-full w-[calc(100%-2.75rem)]">
                  {truckBadge('')}
                </motion.div>
              </div>
            </div>
          </>
        )}

        <ol ref={listRef} className="relative grid gap-6 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => {
            const on = reached[i] || reduce
            return (
              <li key={step.title} data-step={i} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span
                  className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 text-lg font-bold transition-colors ${reduce ? '' : 'duration-300'} ${
                    on ? 'border-brand-black bg-brand-yellow text-brand-black' : 'border-line bg-white text-muted'
                  }`}
                >
                  {i + 1}
                </span>
                <div className={`rounded-2xl border bg-white p-5 transition-colors lg:w-full ${reduce ? '' : 'duration-300'} ${on ? 'border-brand-black' : 'border-line'}`}>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-muted">{step.text}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
      <div className="mt-10">
        <WhatsAppButton />
      </div>
    </Section>
  )
}
