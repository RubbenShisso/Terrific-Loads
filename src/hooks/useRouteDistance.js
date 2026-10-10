import { useEffect, useState } from 'react'
import { routeThrough } from '../lib/routeDistance.js'

/**
 * Distance through a list of stops, in order (quote form).
 *
 *   const d = useRouteDistance(stops)   // stops: [{ text, point? }], empty ones already removed
 *   d.status: 'idle' | 'loading' | 'done' | 'not-found' | 'error'
 *   d.km, d.minutes, d.source, d.key, d.missing (index into stops)
 */
export function useRouteDistance(stops) {
  const [state, setState] = useState({ status: 'idle' })
  const clean = stops.map((s) => ({ text: s.text.trim(), point: s.point }))
  const ready = clean.length >= 2 && clean.every((s) => s.text.length >= 3)
  const key = JSON.stringify(clean.map((s) => [s.text, s.point?.lat ?? null, s.point?.lon ?? null]))

  useEffect(() => {
    if (!ready) {
      setState({ status: 'idle' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    routeThrough(clean, { signal: controller.signal })
      .then((r) => {
        if (r.notFound !== undefined) setState({ status: 'not-found', missing: r.notFound, key })
        else setState({ status: 'done', ...r, key })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', key })
      })
    return () => controller.abort()
  }, [key, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  return state
}
