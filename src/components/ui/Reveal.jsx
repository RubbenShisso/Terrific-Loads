import { motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'

/** Fade and 12px rise as content scrolls into view, once only. Instant with reduced motion. */
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...props }) {
  const Tag = motion[as]
  const reduce = useReducedMotionSafe()
  if (reduce) {
    const Plain = as
    return <Plain className={className} {...props}>{children}</Plain>
  }
  return (
    <Tag
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}
