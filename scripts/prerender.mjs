/**
 * Writes static HTML for every route after `vite build`, so the hero, text and
 * images arrive in the first response instead of waiting for JavaScript.
 *
 *   dist/index.html, dist/about.html, dist/services.html, ... dist/404.html
 *
 * The browser then hydrates the page (see src/main.jsx).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
// Kept under node_modules so dev-server file watchers never lock it.
const SSR_DIR = 'node_modules/.prerender'

const { render } = await import(pathToFileURL(path.resolve(SSR_DIR, 'entry-server.js')).href)
const { pages, fullTitle } = await import(pathToFileURL(path.resolve('src/config/seo.js')).href)

const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

// Vite's manifest tells us each lazy page's chunk, so its HTML can preload it.
const manifestPath = path.join(DIST, '.vite', 'manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const pageSource = { about: 'About', services: 'Services', quote: 'Quote', contact: 'Contact', privacy: 'Privacy', notFound: 'NotFound' }
function preloadLinks(key) {
  const entry = pageSource[key] && manifest[`src/pages/${pageSource[key]}.jsx`]
  if (!entry) return ''
  const files = new Set([entry.file])
  const walk = (k) => (manifest[k]?.imports || []).forEach((i) => { if (!manifest[i].isEntry) { files.add(manifest[i].file); walk(i) } })
  walk(`src/pages/${pageSource[key]}.jsx`)
  return [...files]
    .filter((f) => !template.includes(`/${f}`)) // already preloaded by Vite
    .map((f) => `    <link rel="modulepreload" crossorigin href="/${f}" />\n`)
    .join('')
}
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const urlFor = (page) => (page.path === '*' ? '/404' : page.path)

// Lazy pages suspend the first time they render, even on the server. Render
// every route once to load them, then render for real below.
for (const page of Object.values(pages)) await render(urlFor(page))

for (const [key, page] of Object.entries(pages)) {
  const url = urlFor(page)
  const appHtml = await render(url)
  if (['<template', '$RC', '<!--$?-->'].some((m) => appHtml.includes(m))) {
    throw new Error(`${url} still contains a pending Suspense boundary`)
  }
  const title = escape(fullTitle(page.title))
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escape(page.description)}$2`)
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${page.path}">${appHtml}</div>`,
    )
    .replace('</head>', `${preloadLinks(key)}${key === 'notFound' ? '    <meta name="robots" content="noindex" />\n' : ''}  </head>`)
  const file = key === 'home' ? 'index.html' : key === 'notFound' ? '404.html' : `${page.path.slice(1)}.html`
  await fs.writeFile(path.join(DIST, file), html)
  console.log(`✓ ${file.padEnd(14)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`)
}

// The manifest was only needed here; don't deploy it.
await fs.rm(path.join(DIST, '.vite'), { recursive: true, force: true })

try {
  await fs.rm(SSR_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 })
} catch (err) {
  console.warn(`(could not remove ${SSR_DIR}: ${err.code}; it is safe to leave)`)
}
