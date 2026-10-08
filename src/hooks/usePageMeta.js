import { useEffect } from 'react'
import { pages, fullTitle } from '../config/seo.js'

/** Sets the document title and meta description for a page key from src/config/seo.js. */
export default function usePageMeta(key) {
  const { title, description } = pages[key]
  useEffect(() => {
    document.title = fullTitle(title)
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
