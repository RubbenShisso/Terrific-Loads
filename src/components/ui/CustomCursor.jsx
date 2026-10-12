import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], summary, label, .chip'
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]), textarea, select'

/**
 * Brand cursor for mouse users: a black dot that tracks the pointer plus a yellow
 * ring that trails it and swells over links and buttons. Off for touch screens and
 * reduced-motion users; text fields keep the normal caret.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const sync = () => setEnabled(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('custom-cursor')
    const target = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0
    let state = ''

    const apply = (el, x, y, scale = 1) => {
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`
    }
    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18
      ringPos.y += (target.y - ringPos.y) * 0.18
      apply(ring.current, ringPos.x, ringPos.y, state === 'link' ? 1.7 : state === 'down' ? 0.8 : 1)
      raf = requestAnimationFrame(tick)
    }
    const move = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      apply(dot.current, e.clientX, e.clientY, state === 'link' ? 0.5 : 1)
      const t = e.target instanceof Element ? e.target : null
      const next = t?.closest(TEXT_FIELD) ? 'text' : t?.closest(INTERACTIVE) ? 'link' : ''
      if (next !== state) {
        state = next
        ring.current?.setAttribute('data-state', next)
        dot.current?.setAttribute('data-state', next)
      }
    }
    const down = () => {
      if (state !== 'link') state = 'down'
    }
    const up = () => {
      if (state === 'down') state = ''
    }
    const leave = () => {
      target.x = target.y = -100
      apply(dot.current, -100, -100)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
