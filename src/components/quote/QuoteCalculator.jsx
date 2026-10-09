import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { Copy, Check, FileText, Info } from 'lucide-react'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import useLocationAutocomplete from '../../hooks/useLocationAutocomplete.jsx'
import { Button } from '../ui/Button.jsx'
import { whatsappLink } from '../../config/business.js'
import { rates, getRate, formatRand, bandLabel } from '../../config/rates.js'
import { itemOptions, whenOptions, buildQuoteMessage } from '../../config/quote.js'

/** Fired by the "Where we deliver" chips to pre-fill the delivery area. */
export const SET_DELIVERY_AREA = 'tl:set-delivery-area'

const SLIDER_MIN = rates.minKm
const SLIDER_MAX = rates.maxPricedKm

// Band chips: one per priced band plus "60+".
const bandChips = [
  ...rates.bands.map((b) => ({ key: `${b.from}-${b.to}`, label: `${b.from}–${b.to}`, value: Math.round((b.from + b.to) / 2), distanceLabel: bandLabel(b), band: b })),
  { key: 'over', label: `${rates.maxPricedKm}+`, value: rates.maxPricedKm + 1, distanceLabel: `over ${rates.maxPricedKm} km`, band: null },
]

function valueText(rate) {
  if (rate.status === 'priced') return `${rate.km} kilometres, ${bandLabel(rate.band)} band, from ${formatRand(rate.price)}`
  if (rate.status === 'over') return `${rate.km} kilometres, over ${rates.maxPricedKm} km, WhatsApp us for a quote`
  return 'No distance entered'
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers without the async clipboard API.
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { ok = false }
    ta.remove()
    return ok
  }
}

export default function QuoteCalculator({ id = 'quote-calculator', quoteHref = '/quote' }) {
  const uid = useId()
  const reduce = useReducedMotionSafe()
  const rootRef = useRef(null)
  const toRef = useRef(null)

  const [distance, setDistance] = useState('')
  const [distanceLabel, setDistanceLabel] = useState(null) // set when a band chip was used
  const [items, setItems] = useState([])
  const [when, setWhen] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [copied, setCopied] = useState(null) // null | 'ok' | 'fail'

  // Real place suggestions in the collection and delivery area boxes.
  const fromAc = useLocationAutocomplete({ value: from, onChange: (e) => setFrom(e.target.value) })
  const toAc = useLocationAutocomplete({ value: to, onChange: (e) => setTo(e.target.value) })

  const rate = useMemo(() => getRate(distance), [distance])
  const message = useMemo(
    () => buildQuoteMessage({ items, when, from, to, rate, distanceLabel: distanceLabel ?? undefined }),
    [items, when, from, to, rate, distanceLabel],
  )

  // "Where we deliver" chips elsewhere on the page pre-fill the delivery area.
  useEffect(() => {
    const onSet = (e) => {
      setTo(e.detail)
      rootRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      setTimeout(() => toRef.current?.focus({ preventScroll: true }), reduce ? 0 : 450)
    }
    window.addEventListener(SET_DELIVERY_AREA, onSet)
    return () => window.removeEventListener(SET_DELIVERY_AREA, onSet)
  }, [reduce])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(null), 2500)
    return () => clearTimeout(t)
  }, [copied])

  const sliderValue = rate.status === 'priced' || rate.status === 'over' ? Math.min(Math.max(rate.km, SLIDER_MIN), SLIDER_MAX) : SLIDER_MIN
  const activeChip = rate.status === 'over' ? 'over' : rate.status === 'priced' ? `${rate.band.from}-${rate.band.to}` : null
  const toggleItem = (item) => setItems((list) => (list.includes(item) ? list.filter((i) => i !== item) : [...list, item]))

  const announce =
    rate.status === 'priced'
      ? `Estimate from ${formatRand(rate.price)}, ${bandLabel(rate.band)}.`
      : rate.status === 'over'
        ? `Over ${rates.maxPricedKm} km. WhatsApp us for a quote.`
        : ''

  const ids = { distance: `${uid}-km`, hint: `${uid}-hint`, error: `${uid}-err`, slider: `${uid}-slider`, from: `${uid}-from`, to: `${uid}-to` }

  return (
    <section id={id} ref={rootRef} aria-labelledby={`${uid}-title`} className="scroll-mt-24 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
        <div className="min-w-0 space-y-7">
          <div>
            <p className="eyebrow">Quote calculator</p>
            <h2 id={`${uid}-title`} className="mt-3 text-2xl font-bold sm:text-3xl">Estimate your delivery</h2>
            <p className="mt-2 text-muted">Three quick steps, then send it to us on WhatsApp.</p>
          </div>

          {/* 1. Distance */}
          <fieldset className="min-w-0">
            <legend className="text-lg font-semibold text-brand-black">1. How far is it?</legend>
            <p id={ids.hint} className="mt-1 text-sm text-muted">
              Roughly how far is it from collection to delivery? A rough guess is fine.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <label htmlFor={ids.distance} className="sr-only">Distance in kilometres</label>
              <div className="relative w-28 shrink-0">
                <input
                  id={ids.distance}
                  type="number"
                  inputMode="decimal"
                  min={rates.minKm}
                  max={rates.maxKm}
                  step="0.1"
                  placeholder="14"
                  value={distance}
                  onChange={(e) => { setDistance(e.target.value); setDistanceLabel(null) }}
                  aria-describedby={`${ids.hint}${rate.status === 'invalid' ? ` ${ids.error}` : ''}`}
                  aria-invalid={rate.status === 'invalid' ? 'true' : undefined}
                  className="block min-h-12 w-full rounded-xl border border-line bg-white py-2 pr-11 pl-4 text-lg font-semibold text-ink focus:border-brand-black"
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted">km</span>
              </div>
              <label htmlFor={ids.slider} className="sr-only">Distance slider, 1 to {SLIDER_MAX} km</label>
              <input
                id={ids.slider}
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step="1"
                value={sliderValue}
                onChange={(e) => { setDistance(e.target.value); setDistanceLabel(null) }}
                aria-valuetext={valueText(rate)}
                className="h-11 min-w-0 flex-1 cursor-pointer accent-brand-black"
              />
            </div>
            {rate.status === 'invalid' && (
              <p id={ids.error} className="mt-2 flex items-center gap-2 text-sm text-ink">
                <Info className="size-4 shrink-0" aria-hidden="true" />
                {rate.message}
              </p>
            )}
            {/* Phones/tablets: the full result panel is further down, so show the estimate right here. */}
            {(rate.status === 'priced' || rate.status === 'over') && (
              <p aria-hidden="true" className="mt-4 flex flex-wrap items-baseline gap-x-2 rounded-xl border border-line bg-surface px-4 py-3 text-brand-black lg:hidden">
                {rate.status === 'priced' ? (
                  <>
                    <span className="font-semibold">From</span>
                    <span className="rounded-md bg-brand-yellow px-1.5 text-2xl font-extrabold tabular-nums">{formatRand(rate.price)}</span>
                    <span className="text-sm text-muted">{bandLabel(rate.band)} · estimate</span>
                  </>
                ) : (
                  <span className="font-semibold">Over {rates.maxPricedKm} km, WhatsApp us for a quote</span>
                )}
              </p>
            )}
            <p className="mt-4 text-sm font-medium text-brand-black" aria-hidden="true">Or pick a range (km)</p>
            {/* 5 km bands: a compact 4-column grid on phones, wrapping chips on larger screens. */}
            <div className="mt-2 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Distance bands in kilometres">
              {bandChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className="chip !px-2 tabular-nums sm:!px-4"
                  aria-pressed={activeChip === c.key}
                  aria-label={c.band ? `${bandLabel(c.band)}, from ${formatRand(c.band.price)}` : `Over ${rates.maxPricedKm} km`}
                  onClick={() => { setDistance(String(c.value)); setDistanceLabel(c.distanceLabel) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* 2. Items */}
          <fieldset>
            <legend className="text-lg font-semibold text-brand-black">
              2. What are we moving? <span className="text-sm font-normal text-muted">(optional)</span>
            </legend>
            <p className="mt-1 text-sm text-muted">This goes into your message. It doesn’t change the estimate.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {itemOptions.map((item) => (
                <label key={item} className="chip">
                  <input type="checkbox" className="sr-only" checked={items.includes(item)} onChange={() => toggleItem(item)} />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>

          {/* 3. When + areas */}
          <fieldset>
            <legend className="text-lg font-semibold text-brand-black">
              3. When? <span className="text-sm font-normal text-muted">(optional)</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {whenOptions.map((o) => (
                <label key={o.value} className="chip">
                  <input
                    type="radio"
                    name={`${uid}-when`}
                    className="sr-only"
                    value={o.value}
                    checked={when === o.value}
                    onChange={() => setWhen(o.value)}
                    onClick={() => when === o.value && setWhen('')}
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={ids.from} className="text-sm font-medium text-brand-black">Collection area <span className="font-normal text-muted">(optional)</span></label>
                <div className="relative">
                  <input id={ids.from} placeholder="e.g. Tyger Valley" {...fromAc.inputProps}
                    className="mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-white px-4 text-ink placeholder:text-muted/80 focus:border-brand-black" />
                  {fromAc.listbox}
                </div>
              </div>
              <div>
                <label htmlFor={ids.to} className="text-sm font-medium text-brand-black">Delivery area <span className="font-normal text-muted">(optional)</span></label>
                <div className="relative">
                  <input id={ids.to} ref={toRef} placeholder="e.g. Durbanville" {...toAc.inputProps}
                    className="mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-white px-4 text-ink placeholder:text-muted/80 focus:border-brand-black" />
                  {toAc.listbox}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Result panel */}
        <div data-hide-action-bar className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <p className="text-sm font-semibold tracking-wider text-muted uppercase">Your estimate</p>
            <div className="mt-2 min-h-[5.5rem]" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={rate.status === 'priced' ? rate.price : rate.status}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                  transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {rate.status === 'priced' && (
                    <>
                      <p className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-brand-black">From</span>
                        <span className="rounded-lg bg-brand-yellow px-2 text-4xl font-extrabold tracking-tight text-brand-black tabular-nums sm:text-5xl">
                          {formatRand(rate.price)}
                        </span>
                      </p>
                      <p className="mt-2 font-medium text-brand-black">{bandLabel(rate.band)}</p>
                    </>
                  )}
                  {rate.status === 'over' && (
                    <p className="text-2xl font-bold text-brand-black">Over {rates.maxPricedKm} km, WhatsApp us for a quote</p>
                  )}
                  {(rate.status === 'empty' || rate.status === 'invalid') && (
                    <p className="text-lg text-muted">Enter a distance to see an estimate.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{announce}</p>
            <p className="mt-3 text-sm text-muted">{rates.note}</p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-brand-black">Your message</p>
              <p className="mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-line bg-white p-3 text-sm whitespace-pre-line text-ink">{message}</p>
            </div>

            <div className="mt-5 grid gap-3">
              <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="w-full">
                <WhatsAppIcon />
                Send this on WhatsApp
              </Button>
              {quoteHref.startsWith('#') ? (
                <Button href={quoteHref} variant="dark" className="w-full">
                  <FileText className="size-5" aria-hidden="true" />
                  Request a Quote
                </Button>
              ) : (
                <Button to={quoteHref} variant="dark" className="w-full">
                  <FileText className="size-5" aria-hidden="true" />
                  Request a Quote
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => setCopied((await copyText(message)) ? 'ok' : 'fail')}
              >
                {copied === 'ok' ? <Check className="size-5" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
                {copied === 'ok' ? 'Copied' : 'Copy message'}
              </Button>
              <p className="sr-only" aria-live="polite">
                {copied === 'ok' ? 'Message copied.' : copied === 'fail' ? 'Copy did not work. Select the message text and copy it.' : ''}
              </p>
              {copied === 'fail' && <p className="text-sm text-ink">Copy didn’t work here. Select the message above and copy it.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
