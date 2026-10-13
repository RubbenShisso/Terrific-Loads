import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import Photo from '../ui/Photo.jsx'
import { heroVideos } from '../../config/content.js'

function useMatch(query) {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatch(mq.matches)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** Skip the video on Save-Data or very slow connections. */
function useVideoAllowed() {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    const c = navigator.connection
    const slow = c && (c.saveData || ['slow-2g', '2g'].includes(c.effectiveType))
    setAllowed(heroVideos.length > 0 && !slow)
  }, [])
  return allowed
}

/**
 * Hero photo with an optional tap-to-play clip. The real truck photo is the
 * poster and the LCP image; the video file is only requested after a tap,
 * always muted, never autoplayed. Thin prev/next buttons step through the
 * clips and start the chosen one. Desktop gets a few pixels of parallax.
 */
export default function HeroMedia() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const reduce = useReducedMotionSafe()
  const desktop = useMatch('(min-width: 1024px) and (pointer: fine)')
  const videoAllowed = useVideoAllowed()
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const video = heroVideos[index]
  const multiple = heroVideos.length > 1

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [8, -8])
  const parallax = desktop && !reduce

  useEffect(() => {
    const v = videoRef.current
    if (!playing || !v) return
    v.muted = true
    v.play().catch(() => setPlaying(false)) // if playback is blocked, fall back to the photo
  }, [playing, index])

  const stop = () => {
    videoRef.current?.pause()
    setPlaying(false)
  }

  const step = (dir) => {
    setIndex((i) => (i + dir + heroVideos.length) % heroVideos.length)
    setPlaying(true)
  }

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div aria-hidden="true" className="absolute -top-3 -right-3 h-2/3 w-2/3 rounded-3xl bg-brand-yellow" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-line shadow-xl shadow-brand-black/15 sm:aspect-[5/6]">
        <motion.div style={parallax ? { y, scale: 1.04 } : undefined} className="absolute inset-0">
          <Photo
            name="loading-truck"
            priority
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
            className="size-full object-cover"
          />
        </motion.div>

        {playing && (
          <video
            key={video.src}
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            src={video.src}
            muted
            playsInline
            preload="auto"
            onEnded={() => setPlaying(false)}
            aria-label={video.label}
          />
        )}

        {videoAllowed && !playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute top-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-black/85 py-2 pr-4 pl-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand-black"
          >
            <span className="grid size-8 place-items-center rounded-full bg-brand-yellow text-brand-black">
              <Play className="size-4 fill-current" aria-hidden="true" />
            </span>
            Play video <span className="sr-only">: {video.label} (muted)</span>
          </button>
        )}
        {playing && (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop video"
            className="absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-brand-black/85 text-white backdrop-blur hover:bg-brand-black"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}

        {videoAllowed && multiple && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous video"
              className="absolute top-1/2 left-2 grid h-14 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand-black/45 text-white backdrop-blur transition hover:bg-brand-black/75"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next video"
              className="absolute top-1/2 right-2 grid h-14 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand-black/45 text-white backdrop-blur transition hover:bg-brand-black/75"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
            {playing && (
              <p aria-live="polite" className="absolute top-4 right-4 rounded-full bg-brand-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {index + 1} / {heroVideos.length}
              </p>
            )}
          </>
        )}
      </div>
      <div className="absolute right-4 -bottom-4 left-4 rounded-2xl border-l-4 border-brand-yellow bg-brand-black p-4 text-white shadow-xl sm:right-6 sm:left-auto sm:w-64">
        <p className="text-sm font-semibold">Real team. Real trucks.</p>
        <p className="mt-0.5 text-sm text-white/80">Collected from the store and delivered to your door.</p>
      </div>
    </div>
  )
}
