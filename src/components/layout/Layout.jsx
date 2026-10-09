import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MobileActionBar from './MobileActionBar.jsx'
import BusinessSchema from './BusinessSchema.jsx'
import { BookingProvider } from '../booking/BookingProvider.jsx'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const outlet = useOutlet()
  const reduce = useReducedMotionSafe()

  // Scroll to top on navigation, or to the #hash target once it has rendered.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else if (tries++ < 10) setTimeout(find, 60)
    }
    find()
  }, [pathname, hash])

  return (
    // BookingProvider: lets any button on any page open the Quick Book flow.
    <BookingProvider>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.08 } }}
              transition={{ duration: reduce ? 0 : 0.16, ease: 'easeOut' }}
            >
              <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>{outlet}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <MobileActionBar />
        <BusinessSchema />
      </div>
    </BookingProvider>
  )
}
