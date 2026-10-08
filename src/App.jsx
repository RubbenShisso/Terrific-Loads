import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import lazyPage from './lazyPage.jsx'

// Home ships in the main bundle; other pages load on demand.
const About = lazyPage(() => import('./pages/About.jsx'))
const Services = lazyPage(() => import('./pages/Services.jsx'))
const Quote = lazyPage(() => import('./pages/Quote.jsx'))
const Contact = lazyPage(() => import('./pages/Contact.jsx'))
const Privacy = lazyPage(() => import('./pages/Privacy.jsx'))
const NotFound = lazyPage(() => import('./pages/NotFound.jsx'))

/** Loads a page's code ahead of hydration (see main.jsx). */
export const preloadPage = {
  '/about': About.preload,
  '/services': Services.preload,
  '/quote': Quote.preload,
  '/contact': Contact.preload,
  '/privacy': Privacy.preload,
  '*': NotFound.preload,
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="quote" element={<Quote />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
