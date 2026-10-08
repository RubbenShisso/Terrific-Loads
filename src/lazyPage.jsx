import { lazy } from 'react'

/**
 * React.lazy with a preload() hook. Once preloaded, the page renders directly
 * instead of suspending, so hydrating a prerendered page never flashes the
 * loading placeholder. Other pages still load on demand.
 */
export default function lazyPage(factory) {
  let Loaded = null
  const load = () => factory().then((m) => { Loaded = m.default; return m })
  const Lazy = lazy(load)
  function Page(props) {
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />
  }
  Page.preload = load
  return Page
}
