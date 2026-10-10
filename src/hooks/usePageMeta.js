import { useEffect } from 'react'
import { pages, fullTitle, canonicalUrl, isIndexable } from '../config/seo.js'

const setMeta = (selector, content) => document.querySelector(selector)?.setAttribute('content', content)

/**
 * Keeps the document title, description, canonical link and social tags in
 * step with the page during client-side navigation. The prerendered HTML
 * already has the right values for the first load (scripts/prerender.mjs).
 */
export default function usePageMeta(key) {
  const page = pages[key]
  const { title, description, path } = page
  const indexable = isIndexable(page)
  useEffect(() => {
    const full = fullTitle(title)
    document.title = full
    setMeta('meta[property="og:title"]', full)
    setMeta('meta[name="twitter:title"]', full)
    if (description) {
      setMeta('meta[name="description"]', description)
      setMeta('meta[property="og:description"]', description)
      setMeta('meta[name="twitter:description"]', description)
    }
    const canonical = document.querySelector('link[rel="canonical"]')
    if (indexable) {
      const url = canonicalUrl(path)
      setMeta('meta[property="og:url"]', url)
      if (canonical) canonical.href = url
      else {
        const link = document.createElement('link')
        link.rel = 'canonical'
        link.href = url
        document.head.appendChild(link)
      }
    } else {
      canonical?.remove()
    }
    let robots = document.querySelector('meta[name="robots"]')
    if (!indexable && !robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex'
      document.head.appendChild(robots)
    } else if (indexable && robots) {
      robots.remove()
    }
  }, [title, description, path, indexable])
}
