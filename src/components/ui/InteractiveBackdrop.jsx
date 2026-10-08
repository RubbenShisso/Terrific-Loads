import { useEffect, useRef } from 'react'

/**
 * Decorative backdrop: a faint dot grid plus a soft yellow glow.
 * On desktop (fine pointer) the glow follows the mouse across the parent section
 * and the dots under it darken slightly. On touch screens, and with reduced
 * motion, the glow simply rests in one corner. Position updates write CSS
 * variables once per animation frame, so React never re-renders.
 *
 * The parent must be `relative` (and ideally `overflow-hidden`); content that
 * should sit above it needs `relative`.
 */
export default function InteractiveBackdrop({ tone = 'light', rest = ['85%', '15%'] }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host) return
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!mq.matches) return

    let frame = 0
    let x = 0
    let y = 0
    const apply = () => {
      frame = 0
      el.style.setProperty('--spot-x', `${x}px`)
      el.style.setProperty('--spot-y', `${y}px`)
      el.dataset.active = 'true'
    }
    const move = (e) => {
      const r = host.getBoundingClientRect()
      x = e.clientX - r.left
      y = e.clientY - r.top
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const leave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      el.dataset.active = 'false'
      el.style.removeProperty('--spot-x')
      el.style.removeProperty('--spot-y')
    }
    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerleave', leave)
    return () => {
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-tone={tone}
      data-active="false"
      style={{ '--rest-x': rest[0], '--rest-y': rest[1] }}
      className="backdrop pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="backdrop-dots absolute inset-0" />
      <div className="backdrop-dots-lit absolute inset-0" />
      <div className="backdrop-glow absolute inset-0" />
    </div>
  )
}
