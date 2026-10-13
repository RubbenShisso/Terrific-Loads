import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { ChevronDown } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import { faqs } from '../../config/content.js'

const itemId = (id) => `faq-${id}`

/**
 * Accessible FAQ: disclosure buttons with aria-expanded/aria-controls, one open
 * at a time, smooth height animation, and deep links (#faq-cost opens that answer).
 */
export default function Faq() {
  const { hash } = useLocation()
  const reduce = useReducedMotionSafe()
  const [open, setOpen] = useState(null)

  // Open the answer named in the URL hash.
  useEffect(() => {
    const match = faqs.find((f) => `#${itemId(f.id)}` === hash)
    if (match) setOpen(match.id)
  }, [hash])

  const toggle = (id) => {
    const next = open === id ? null : id
    setOpen(next)
    // Keep the URL shareable without jumping the page.
    const url = next ? `#${itemId(next)}` : window.location.pathname + window.location.search
    window.history.replaceState(window.history.state, '', url)
  }

  // Answers are only rendered when opened, so give search engines the full text here.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }

  return (
    <Section id="faq" className="bg-surface">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow="FAQ" title="Questions we get asked" intro="Can’t see your question? Send us a WhatsApp and we’ll answer it." />
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {faqs.map(({ id, q, a }) => {
            const isOpen = open === id
            const panelId = `${itemId(id)}-panel`
            return (
              <div key={id} id={itemId(id)} className={`scroll-mt-28 border-l-4 ${isOpen ? 'border-brand-yellow' : 'border-transparent'}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(id)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-brand-black sm:px-6"
                  >
                    {q}
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? 'bg-brand-yellow' : 'bg-surface'}`}>
                      <ChevronDown
                        className={`size-4 text-brand-black ${reduce ? '' : 'transition-transform duration-200'} ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-label={q}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { height: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted sm:px-6">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
