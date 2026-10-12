import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'

/** Thin yellow bar that sweeps across the top when you move to another page. */
export default function RouteProgress() {
  const { pathname } = useLocation()
  const reduce = useReducedMotionSafe()
  const first = useRef(true)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setRun((n) => n + 1)
  }, [pathname])
  if (reduce || run === 0) return null
  return (
    <motion.div
      key={run}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] h-1 w-full origin-left bg-brand-yellow shadow-[0_0_8px_var(--color-brand-yellow)]"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: [1, 1, 0] }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    />
  )
}
