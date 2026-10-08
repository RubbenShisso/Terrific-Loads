/**
 * Converts the client's real photos into responsive WebP files.
 *
 *   npm run images
 *
 * Reads from client-assets/ (local only, never deployed) and writes:
 *   public/images/<slug>-<width>.webp
 *   public/og-image.jpg, favicons, src/assets/logo.png
 *   src/config/photos.generated.js   (sizes + alt text used by <Photo />)
 *
 * Deliberately excluded from the client folder: phone screenshots,
 * 12.26.18 (a personal finance spreadsheet, never publish),
 * duplicates, AI/mockup marketing graphics, and any personal documents.
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const SRC = 'client-assets'
const OUT = 'public/images'
const WIDTHS = [480, 800, 1200]
const MAX = 1200
const QUALITY = 66

const photos = [
  { slug: 'loading-truck', file: 'WhatsApp Image 2026-10-08 at 12.26.19.jpeg',
    alt: 'Terrific Loads team member loading wrapped furniture into a delivery truck' },
  { slug: 'team', file: 'WhatsApp Image 2026-10-08 at 11.25.44.jpeg',
    alt: 'Three Terrific Loads team members standing in front of their delivery truck' },
  { slug: 'team-truck-doors', file: 'WhatsApp Image 2026-10-08 at 11.27.10.jpeg',
    alt: 'Two team members in Terrific Loads shirts opening the doors of a delivery truck' },
  { slug: 'carrying-bench', file: 'WhatsApp Image 2026-10-08 at 12.13.11.jpeg',
    alt: "Two team members carrying a wrapped wooden bench through a customer's garden" },
  { slug: 'store-collection', file: 'WhatsApp Image 2026-10-08 at 12.09.21.jpeg',
    alt: 'Team member carrying a wrapped décor piece through a furniture showroom' },
  { slug: 'carrying-home', file: 'WhatsApp Image 2026-10-08 at 12.26.19 (1).jpeg',
    alt: "Team member carrying wrapped items to a customer's front door" },
  { slug: 'delivered-table', file: 'WhatsApp Image 2026-10-08 at 12.14.19.jpeg',
    alt: "Oval dining table set up in a customer's dining room after delivery" },
  { slug: 'table-loaded', file: 'WhatsApp Image 2026-10-08 at 12.08.38.jpeg',
    alt: 'Table and boxed furniture secured inside a delivery truck' },
  { slug: 'truck-loaded', file: 'WhatsApp Image 2026-10-08 at 11.22.21.jpeg',
    alt: 'Delivery truck loaded with wrapped furniture' },
  { slug: 'delivery-home', file: 'WhatsApp Image 2026-10-08 at 11.22.21 (1).jpeg',
    alt: "Truck unloading a wrapped chair at a customer's home" },
  { slug: 'truck-coast', file: 'WhatsApp Image 2026-10-08 at 11.23.10.jpeg',
    alt: 'Terrific Loads truck parked beside a coastal road' },
  { slug: 'truck-chairs', file: 'WhatsApp Image 2026-10-08 at 11.24.05.jpeg',
    alt: 'Delivery truck loaded with bubble-wrapped chairs' },
  { slug: 'desk-placed', file: 'WhatsApp Image 2026-10-08 at 12.15.35 (1).jpeg',
    alt: 'Wooden desk being positioned in place after delivery' },
  { slug: 'rugs-delivered', file: 'WhatsApp Image 2026-10-08 at 12.15.35.jpeg',
    alt: "Wrapped rugs delivered to a customer's home" },
]

// Empty the folder rather than deleting it, so file watchers on Windows don't lock it.
await fs.mkdir(OUT, { recursive: true })
for (const f of await fs.readdir(OUT)) await fs.rm(path.join(OUT, f), { force: true })
const manifest = {}

for (const p of photos) {
  const input = path.join(SRC, p.file)
  const base = sharp(input).rotate()
  const meta = await base.metadata()
  const srcW = meta.autoOrient?.width ?? meta.width
  const srcH = meta.autoOrient?.height ?? meta.height
  const widths = WIDTHS.filter((w) => w <= srcW)
  if (!widths.length || widths.at(-1) < srcW) widths.push(Math.min(srcW, MAX))
  const unique = [...new Set(widths)].filter((w) => w <= MAX)

  for (const w of unique) {
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT, `${p.slug}-${w}.webp`))
  }
  manifest[p.slug] = { alt: p.alt, width: srcW, height: srcH, widths: unique }
  console.log(`✓ ${p.slug} (${unique.join(', ')})`)
}

// ---------------------------------------------------------------------------
// Brand assets from the client's logo and favicon files (transparent PNGs,
// kept in client-assets/brand/). Trimmed and resized only, never recoloured.
// ---------------------------------------------------------------------------
const BRAND = path.join(SRC, 'brand')
const LOGO_SRC = path.join(BRAND, 'TerrificLoads Furniture Delivery Logo.png')
const MARK_SRC = path.join(BRAND, 'favicon1.png')
const clear = { r: 0, g: 0, b: 0, alpha: 0 }
const white = { r: 255, g: 255, b: 255, alpha: 1 }

await fs.mkdir('src/assets', { recursive: true })
await sharp(LOGO_SRC).trim({ threshold: 1 }).resize({ width: 1000 })
  .png({ compressionLevel: 9, palette: true, colours: 128 })
  .toFile('src/assets/logo.png')
console.log('✓ src/assets/logo.png')

// Square icon from the truck mark: trimmed, centred, with a little breathing room.
const mark = await sharp(MARK_SRC).trim({ threshold: 1 }).toBuffer()
async function squareIcon(size, file, { background = clear, pad = 0.04 } = {}) {
  const inner = Math.round(size * (1 - pad * 2))
  const art = await sharp(mark).resize(inner, inner, { fit: 'contain', background: clear }).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: art, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(file)
}
await squareIcon(32, 'public/favicon-32.png', { pad: 0 })
await squareIcon(512, 'public/icon-512.png')
// iOS fills transparency with black, which would hide the black truck, so this one is white.
await squareIcon(180, 'public/apple-touch-icon.png', { background: white, pad: 0.1 })
console.log('✓ favicons')

// Social share image (1200x630): logo on white beside a real team photo.
const ogPhoto = await sharp(path.join(SRC, 'WhatsApp Image 2026-10-08 at 11.25.44.jpeg')).rotate()
  .resize(560, 630, { fit: 'cover', position: 'top' }).toBuffer()
const ogLogo = await sharp('src/assets/logo.png').resize({ width: 560 }).toBuffer()
const ogLogoMeta = await sharp(ogLogo).metadata()
await sharp({ create: { width: 1200, height: 630, channels: 3, background: white } })
  .composite([
    { input: ogLogo, left: 40, top: Math.round((630 - ogLogoMeta.height) / 2) },
    { input: ogPhoto, left: 640, top: 0 },
  ])
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile('public/og-image.jpg')
console.log('✓ og-image.jpg')

// Hero video: the real "Loading" clip, played only when a visitor taps Play.
await fs.mkdir('public/videos', { recursive: true })
await fs.copyFile(path.join(SRC, 'WhatsApp Video 2026-10-08 at 12.13.05.mp4'), 'public/videos/loading.mp4')
console.log('✓ public/videos/loading.mp4')

const js = `// Generated by scripts/optimize-images.mjs. Do not edit by hand.
export const photos = ${JSON.stringify(manifest, null, 2)}
`
await fs.writeFile('src/config/photos.generated.js', js)
console.log('✓ src/config/photos.generated.js')
