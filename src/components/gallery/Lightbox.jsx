import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { photos } from '../../config/photos.generated.js'

const srcSetFor = (name) => photos[name].widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')
const largest = (name) => `/images/${name}-${photos[name].widths.at(-1)}.webp`

/**
 * Full-screen photo viewer: swipe, arrow keys, Escape, focus trap, caption.
 * Only the next image is preloaded.
 */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const reduce = useReducedMotionSafe()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const start = useRef(null)
  const count = items.length
  const item = items[index]
  const meta = photos[item.photo]

  const go = useCallback((step) => onIndex((index + step + count) % count), [index, count, onIndex])

  // Lock page scroll and move focus into the dialog.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { html.style.overflow = prev }
  }, [])

  // Preload only the next image.
  useEffect(() => {
    const next = items[(index + 1) % count].photo
    const img = new Image()
    img.sizes = '100vw'
    img.srcset = srcSetFor(next)
    img.src = largest(next)
  }, [index, items, count])

  // Keys are handled on the document so they work wherever focus is.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
      else if (e.key === 'Tab') {
        // Focus trap over the buttons that are actually visible at this size.
        const f = [...dialogRef.current.querySelectorAll('button')].filter((b) => b.offsetParent !== null)
        const first = f[0], last = f.at(-1)
        const inside = dialogRef.current.contains(document.activeElement)
        if (!inside) { e.preventDefault(); first.focus() }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [go, onClose])

  const onPointerDown = (e) => { start.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    start.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  const navBtn = 'grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20'

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}: ${item.caption}`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      className="fixed inset-0 z-50 flex flex-col bg-brand-black text-white"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm text-white/80" aria-live="polite">{index + 1} / {count}</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className={navBtn}>
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={item.photo}
            src={largest(item.photo)}
            srcSet={srcSetFor(item.photo)}
            sizes="100vw"
            width={meta.width}
            height={meta.height}
            alt={meta.alt}
            draggable="false"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="max-h-full w-auto max-w-full rounded-lg object-contain select-none"
          />
        </AnimatePresence>
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${navBtn} absolute left-3 hidden sm:grid`}>
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${navBtn} absolute right-3 hidden sm:grid`}>
          <ChevronRight className="size-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:justify-center sm:px-6">
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${navBtn} sm:hidden`}>
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <p className="text-center font-semibold">{item.caption}</p>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${navBtn} sm:hidden`}>
          <ChevronRight className="size-6" aria-hidden="true" />
        </button>
      </div>
    </motion.div>,
    document.body,
  )
}
