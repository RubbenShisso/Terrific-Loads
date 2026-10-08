import { useEffect, useRef } from 'react'

const MAX = 6 // px

/**
 * Subtle magnetic pull toward the pointer, desktop only (fine pointer, 1024px+),
 * never with reduced motion. Uses the CSS `translate` property so it doesn't
 * fight Tailwind's transform-based press state.
 */
export default function useMagnetic(enabled = true) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    if (!mq.matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX
      const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX
      el.style.translate = `${Math.max(-MAX, Math.min(MAX, dx)).toFixed(1)}px ${Math.max(-MAX, Math.min(MAX, dy)).toFixed(1)}px`
    }
    const leave = () => { el.style.translate = '' }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      el.style.translate = ''
    }
  }, [enabled])
  return ref
}
