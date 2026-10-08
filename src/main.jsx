import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App, { preloadPage } from './App.jsx'
import { knownPaths } from './config/seo.js'
import './index.css'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Each page is prerendered to HTML at build time (scripts/prerender.mjs).
// Hydrate when that HTML belongs to the current URL; otherwise render fresh
// (for example the dev server, or an unknown URL served the home page HTML).
const root = document.getElementById('root')
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const route = root.dataset.route
const matches = route === path || (route === '*' && !knownPaths.includes(path))

if (root.hasChildNodes() && matches) {
  // Load this page's code first so hydration never has to suspend.
  const preload = preloadPage[route]
  Promise.resolve(preload?.())
    .catch(() => {})
    .then(() => hydrateRoot(root, app))
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
