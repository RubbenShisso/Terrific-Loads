import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useRef, useState } from 'react'

// The booking flow's code loads only when someone opens it.
const loadWizard = () => import('./BookingWizard.jsx')
const BookingWizard = lazy(loadWizard)

const BookingContext = createContext({ openBooking: () => {}, preloadBooking: () => {} })

/**
 * One booking flow for the whole site. Any button can call
 * openBooking({ scenario, itemId }) to open it with that scenario or item pre-filled.
 */
export function BookingProvider({ children }) {
  const [state, setState] = useState(null) // null = closed, else { scenario, itemId, key }
  const opener = useRef(null)

  const openBooking = useCallback((preset = {}) => {
    opener.current = document.activeElement
    setState({ ...preset, key: Date.now() })
  }, [])

  const close = useCallback(() => {
    setState(null)
    const el = opener.current
    requestAnimationFrame(() => el?.focus?.())
  }, [])

  const value = useMemo(() => ({ openBooking, preloadBooking: loadWizard }), [openBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
      {state && (
        <Suspense fallback={null}>
          <BookingWizard preset={state} onClose={close} />
        </Suspense>
      )}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)

/** Spread onto any Quick Book button: opens the flow and preloads it on hover/focus. */
export function useQuickBookProps(preset) {
  const { openBooking, preloadBooking } = useBooking()
  return {
    type: 'button',
    onClick: () => openBooking(preset),
    onPointerEnter: preloadBooking,
    onFocus: preloadBooking,
    'aria-haspopup': 'dialog',
  }
}
