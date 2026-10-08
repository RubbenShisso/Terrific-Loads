import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * prefers-reduced-motion, but `false` until the component has mounted.
 * Pages are prerendered to HTML at build time, so the first browser render
 * must match the server's (which can't know the visitor's setting). Anything
 * that changes markup based on reduced motion goes through this hook.
 */
export default function useReducedMotionSafe() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? Boolean(reduce) : false
}
