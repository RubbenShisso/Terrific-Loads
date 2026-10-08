import { motion } from 'motion/react'
import { Container } from '../ui/Section.jsx'
import InteractiveBackdrop from '../ui/InteractiveBackdrop.jsx'

/** Light page header for inner pages: off-white with a yellow rule underneath. */
export default function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <section data-hero className="relative overflow-hidden border-b-4 border-brand-yellow bg-surface">
      <InteractiveBackdrop />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
          {intro && <p className="mt-4 text-lg text-muted sm:text-xl">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </Container>
    </section>
  )
}
