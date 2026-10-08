import { StrictMode } from 'react'
import { StaticRouter } from 'react-router'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App.jsx'

/**
 * Renders one route to an HTML string at build time. Waits for lazy pages.
 * progressiveChunkSize: Infinity keeps every Suspense boundary inline. React
 * otherwise outlines large boundaries for streaming and reveals them a beat
 * later, which on a static page only causes layout shift.
 */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
