import { useEffect, useState } from 'react'
import { nextSlot } from '../../lib/nextSlot.js'

/** Live availability hint. Empty in the prerendered HTML, filled in once the page loads. */
export default function NextSlot() {
  const [text, setText] = useState('')
  useEffect(() => {
    const update = () => setText(nextSlot())
    update()
    const id = setInterval(update, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <p className="mt-3 flex min-h-6 items-center gap-2 text-sm font-medium text-brand-black" aria-live="polite">
      {text && (
        <>
          <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-whatsapp opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full bg-whatsapp" />
          </span>
          <span>
            {text} <span className="text-muted">Subject to availability.</span>
          </span>
        </>
      )}
    </p>
  )
}
