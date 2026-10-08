import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { WhatsAppButton, QuoteButton } from '../ui/Button.jsx'
import { Container } from '../ui/Section.jsx'
import { nav } from '../../config/content.js'

// Active link: black text with a yellow underline bar.
const linkCls = ({ isActive }) =>
  `relative rounded-md px-2.5 py-2 text-[0.95rem] xl:px-3 font-medium text-brand-black transition-colors hover:bg-surface after:absolute after:inset-x-3 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-brand-yellow after:transition-transform ${
    isActive ? 'after:scale-x-100' : 'after:scale-x-0'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkCls}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <QuoteButton className="!min-h-11 !px-3.5 text-sm xl:!px-4" />
          <WhatsAppButton className="!min-h-11 !px-3.5 text-sm xl:!px-4" />
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-brand-black lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {/* Thin yellow reading-progress bar under the header. */}
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 -bottom-px h-[3px] origin-left bg-brand-yellow" />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full border-b border-line bg-white shadow-lg lg:hidden"
          >
            <Container className="py-4">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `rounded-lg border-l-4 px-3 py-3 text-lg font-medium text-brand-black ${
                        isActive ? 'border-brand-yellow bg-surface' : 'border-transparent'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-4 grid gap-3 border-t border-line pt-4">
                <WhatsAppButton />
                <QuoteButton />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
