import { useEffect, useState } from 'react'
import { aboutVideo } from '../../config/content.js'
import { business } from '../../config/business.js'

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
 * play with the native controls. Only metadata is fetched up front; a still
 * from the video is the poster. VideoObject data lets search engines list it.
 */
export default function AboutVideo() {
  const portrait = usePortrait()
  const src = portrait ? aboutVideo.portrait : aboutVideo.landscape
  const poster = portrait ? aboutVideo.portraitPoster : aboutVideo.landscapePoster

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: aboutVideo.label,
    description: aboutVideo.description,
    thumbnailUrl: [business.siteUrl + aboutVideo.landscapePoster, business.siteUrl + aboutVideo.portraitPoster],
    contentUrl: business.siteUrl + aboutVideo.landscape,
    uploadDate: aboutVideo.uploadDate,
    duration: aboutVideo.duration,
    publisher: { '@id': `${business.siteUrl}/#business` },
  }

  return (
    <div
      className={`mx-auto overflow-hidden rounded-3xl bg-brand-black shadow-xl shadow-brand-black/15 ${
        portrait ? 'aspect-[9/16] w-full max-w-sm' : 'aspect-video w-full max-w-4xl'
      }`}
    >
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <video
        key={src}
        className="size-full object-contain"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        aria-label={aboutVideo.label}
      />
    </div>
  )
}
