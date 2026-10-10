/**
 * Writes static HTML for every route after `vite build`, so the hero, text and
 * images arrive in the first response instead of waiting for JavaScript.
 *
 *   dist/index.html, dist/about.html, dist/services.html, ... dist/404.html
 *   dist/sitemap.xml and dist/robots.txt (from the page list in src/config/seo.js)
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
const { pages, fullTitle, canonicalUrl, absoluteUrl, isIndexable, SITE_URL, OG_IMAGE } = await import(
  pathToFileURL(path.resolve('src/config/seo.js')).href
)

const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

// Vite's manifest tells us each lazy page's chunk, so its HTML can preload it.
const manifestPath = path.join(DIST, '.vite', 'manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
const pageSource = { about: 'About', services: 'Services', quote: 'Quote', contact: 'Contact', privacy: 'Privacy', sitemap: 'Sitemap', notFound: 'NotFound' }
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

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->\n?/
if (!SEO_BLOCK.test(template)) throw new Error('index.html is missing the <!-- seo:start --> ... <!-- seo:end --> block')

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
function seoTags(page) {
  const title = escape(fullTitle(page.title))
  const description = escape(page.description)
  const indexable = isIndexable(page)
  const image = absoluteUrl(OG_IMAGE.path)
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    indexable ? `<link rel="canonical" href="${canonicalUrl(page.path)}" />` : '<meta name="robots" content="noindex" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Terrific Loads" />',
    '<meta property="og:locale" content="en_ZA" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    indexable && `<meta property="og:url" content="${canonicalUrl(page.path)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${escape(OG_IMAGE.alt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escape(OG_IMAGE.alt)}" />`,
  ]
  return tags.filter(Boolean).map((t) => `    ${t}\n`).join('')
}

// Lazy pages suspend the first time they render, even on the server. Render
// every route once to load them, then render for real below.
for (const page of Object.values(pages)) await render(urlFor(page))

for (const [key, page] of Object.entries(pages)) {
  const url = urlFor(page)
  const appHtml = await render(url)
  if (['<template', '$RC', '<!--$?-->'].some((m) => appHtml.includes(m))) {
    throw new Error(`${url} still contains a pending Suspense boundary`)
  }
  const html = template
    // Function form so "$" in a description is never read as a replacement pattern.
    .replace(SEO_BLOCK, () => seoTags(page).replace(/^ {4}/, ''))
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${page.path}">${appHtml}</div>`,
    )
    .replace('</head>', `${preloadLinks(key)}  </head>`)
  const file = key === 'home' ? 'index.html' : key === 'notFound' ? '404.html' : `${page.path.slice(1)}.html`
  await fs.writeFile(path.join(DIST, file), html)
  console.log(`✓ ${file.padEnd(14)} ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`)
}

// sitemap.xml: every indexable page, with today's date as the last change.
// Cape Town date, so a late-evening build isn't stamped with yesterday (UTC).
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' })
const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Object.values(pages)
    .filter(isIndexable)
    .map((p) => [
      '  <url>',
      `    <loc>${canonicalUrl(p.path)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      p.changefreq && `    <changefreq>${p.changefreq}</changefreq>`,
      p.priority && `    <priority>${p.priority}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n')),
  '</urlset>',
  '',
].join('\n')
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml)
console.log(`✓ sitemap.xml    ${Object.values(pages).filter(isIndexable).length} URLs`)

await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log('✓ robots.txt')

// The manifest was only needed here; don't deploy it.
await fs.rm(path.join(DIST, '.vite'), { recursive: true, force: true })

try {
  await fs.rm(SSR_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 })
} catch (err) {
  console.warn(`(could not remove ${SSR_DIR}: ${err.code}; it is safe to leave)`)
}
