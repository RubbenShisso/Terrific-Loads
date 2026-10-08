import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Expand } from 'lucide-react'
import { Section, SectionHeading } from '../ui/Section.jsx'
import Photo from '../ui/Photo.jsx'
import Reveal from '../ui/Reveal.jsx'
import { gallery } from '../../config/content.js'

// The viewer's code loads only when someone opens a photo.
const loadLightbox = () => import('../gallery/Lightbox.jsx')
const Lightbox = lazy(loadLightbox)

export default function Gallery() {
  const [open, setOpen] = useState(null)
  const triggers = useRef([])

  const close = () => {
    const i = open
    setOpen(null)
    requestAnimationFrame(() => triggers.current[i]?.focus())
  }

  return (
    <Section id="our-work" aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        eyebrow="Recent deliveries"
        title="These are our jobs, not stock photos"
        intro="Our own team and trucks, collecting customers’ purchases and delivering them around Cape Town. Tap a photo to see it bigger."
      />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {gallery.map(({ photo, caption }, i) => (
          <Reveal as="li" key={photo} delay={(i % 4) * 0.05}>
            <button
              type="button"
              ref={(el) => (triggers.current[i] = el)}
              onClick={() => setOpen(i)}
              onPointerEnter={loadLightbox}
              onFocus={loadLightbox}
              aria-label={`Open photo: ${caption}`}
              className="group relative block w-full overflow-hidden rounded-2xl bg-line text-left"
            >
              <Photo
                name={photo}
                sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 50vw"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-brand-black/85 to-transparent px-3 pt-10 pb-3 text-sm font-semibold text-white">
                {caption}
                <Expand className="size-4 shrink-0 opacity-80" aria-hidden="true" />
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <Suspense fallback={null}>
        <AnimatePresence>
          {open !== null && <Lightbox key="lightbox" items={gallery} index={open} onIndex={setOpen} onClose={close} />}
        </AnimatePresence>
      </Suspense>
    </Section>
  )
}
