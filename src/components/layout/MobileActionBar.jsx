import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { FileText } from 'lucide-react'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import { Button } from '../ui/Button.jsx'
import { whatsappLink } from '../../config/business.js'

/**
 * Bottom action bar for phones and tablets (hidden from lg up, where the header
 * has both buttons). Shows once the page hero has scrolled away; hides near the
 * footer, the quote form and the calculator's buttons, so it never covers them.
 * Positions are read on scroll (one rAF per frame), so lazily loaded pages work.
 */
export default function MobileActionBar() {
  const { pathname } = useLocation()
  const reduce = useReducedMotionSafe()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      const hero = document.querySelector('main [data-hero]')
      const pastHero = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 400
      const onScreen = (el) => {
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < vh - 40 && r.bottom > 0
      }
      const blocked =
        onScreen(document.querySelector('footer')) ||
        onScreen(document.getElementById('quote-form')) ||
        [...document.querySelectorAll('[data-hide-action-bar]')].some(onScreen)
      setShow(pastHero && !blocked)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    setShow(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const t = setTimeout(update, 300) // after the route transition
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      clearTimeout(t)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Quick actions"
          initial={reduce ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { y: '100%' }}
          transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgb(0_0_0/0.08)] backdrop-blur lg:hidden"
        >
          <div className="mx-auto grid max-w-xl grid-cols-2 gap-3">
            <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="w-full">
              <WhatsAppIcon />
              WhatsApp
            </Button>
            <Button to="/quote" variant="dark" className="w-full">
              <FileText className="size-5" aria-hidden="true" />
              Get a Quote
            </Button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
