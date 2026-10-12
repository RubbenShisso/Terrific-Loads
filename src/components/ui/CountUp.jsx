import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'

/**
 * A number that counts up to `value` (and re-counts from where it was when the
 * value changes). Starts when scrolled into view unless `immediate`. Reduced
 * motion and the prerendered HTML show the final number straight away.
 */
export default function CountUp({ value, format = (n) => String(Math.round(n)), immediate = false, duration = 1.1 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduce = useReducedMotionSafe()
  const [shown, setShown] = useState(value)
  const from = useRef(null)

  useEffect(() => {
    if (reduce || (!immediate && !inView)) {
      setShown(value)
      return
    }
    const start = from.current ?? (immediate ? shown : 0)
    const controls = animate(start, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        from.current = n
        setShown(n)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      {format(shown)}
    </span>
  )
}
