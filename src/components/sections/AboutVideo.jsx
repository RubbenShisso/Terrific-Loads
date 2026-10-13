import { useEffect, useState } from 'react'
import { aboutVideo } from '../../config/content.js'

/** Portrait screens (phones) get the vertical cut; everything else gets landscape. */
function usePortrait() {
  const [portrait, setPortrait] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px) and (orientation: portrait)')
    setPortrait(mq.matches)
    const on = () => setPortrait(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return portrait
}

/**
 * Informative promo video with sound. Never autoplays: the visitor presses
 * play with the native controls. Only metadata is fetched up front (the
 * #t=0.1 fragment gives iOS a first frame to show as the poster).
 */
export default function AboutVideo() {
  const portrait = usePortrait()
  const src = portrait ? aboutVideo.portrait : aboutVideo.landscape

  return (
    <div
      className={`mx-auto overflow-hidden rounded-3xl bg-brand-black shadow-xl shadow-brand-black/15 ${
        portrait ? 'aspect-[9/16] w-full max-w-sm' : 'aspect-video w-full max-w-4xl'
      }`}
    >
      <video
        key={src}
        className="size-full object-contain"
        src={`${src}#t=0.1`}
        controls
        playsInline
        preload="metadata"
        aria-label={aboutVideo.label}
      />
    </div>
  )
}
