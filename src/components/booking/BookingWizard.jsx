import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CircleCheck, CircleAlert, LoaderCircle, RotateCcw, X, CalendarCheck } from 'lucide-react'
import useReducedMotionSafe from '../../hooks/useReducedMotionSafe.js'
import { Button } from '../ui/Button.jsx'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import ScenarioSelect from './ScenarioSelector.jsx'
import ItemSelector from './ItemSelector.jsx'
import CollectionDetails from './CollectionDetails.jsx'
import DeliveryDetails from './DeliveryDetails.jsx'
import DateSelector from './DateSelector.jsx'
import CustomerDetails from './CustomerDetails.jsx'
import QuoteSummary from './QuoteSummary.jsx'
import { whatsappLink } from '../../config/business.js'
import { scenarioById } from '../../config/scenarios.js'
import { itemById, MAX_QUANTITY } from '../../config/items.js'
import { calculateQuote, quoteTotalLabel } from '../../lib/calculateQuote.js'
import { checkServiceArea } from '../../lib/serviceAreaCheck.js'
import { buildBookingMessage } from '../../lib/buildWhatsAppMessage.js'
import { getAvailableSlots } from '../../lib/availability.js'
import { getRoadDistance, mapsEnabled } from '../../lib/calculateDistance.js'
import { bookingBackend, createBookingId, createBookingRecord, submitBooking } from '../../services/bookingService.js'

const STEPS = [
  { id: 'items', title: 'What are we collecting?' },
  { id: 'collection', title: 'Collection details' },
  { id: 'delivery', title: 'Delivery details' },
  { id: 'date', title: 'Delivery date' },
  { id: 'customer', title: 'Your details' },
  { id: 'quote', title: 'Your estimated quote' },
]

const DRAFT_KEY = 'tl-booking-draft'
const PHONE_RE = /^\+?\d{9,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const cleanPhone = (v) => (v || '').replace(/[\s\-()]/g, '')
const uid = () => Math.random().toString(36).slice(2, 9)

const emptyBooking = () => ({
  scenario: 'store',
  items: [],
  collection: { type: 'store', storeName: '', address: '', contactName: '', notes: '', place: '' },
  delivery: { address: '', contactName: '', contactNumber: '', propertyType: '', stairs: false, access: '', notes: '', place: '' },
  distance: { km: '', source: 'manual', durationMin: null },
  date: '',
  timeSlot: '',
  customer: { name: '', whatsapp: '', phone: '', email: '' },
})

function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return a.state
    case 'reset':
      return emptyBooking()
    case 'setScenario': {
      const prevDefault = scenarioById[state.scenario]?.collectionType
      const nextDefault = scenarioById[a.scenario]?.collectionType
      // Follow the scenario's collection type unless the customer already changed it.
      const type = !state.collection.type || state.collection.type === prevDefault ? nextDefault : state.collection.type
      return { ...state, scenario: a.scenario, collection: { ...state.collection, type } }
    }
    case 'set':
      if (a.section === 'collection' && a.field === 'address') return { ...state, collection: { ...state.collection, address: a.value, place: '' } }
      if (a.section === 'delivery' && a.field === 'address') return { ...state, delivery: { ...state.delivery, address: a.value, place: '' } }
      return { ...state, [a.section]: { ...state[a.section], [a.field]: a.value } }
    case 'addItem': {
      const existing = state.items.find((i) => i.id === a.id && !itemById[a.id].needsDescription)
      if (existing && a.onlyIfMissing) return state
      if (existing) return { ...state, items: state.items.map((i) => (i === existing ? { ...i, qty: Math.min(MAX_QUANTITY, i.qty + 1) } : i)) }
      return { ...state, items: [...state.items, { uid: uid(), id: a.id, qty: 1, description: '' }] }
    }
    case 'setQty':
      return { ...state, items: state.items.map((i) => (i.uid === a.uid ? { ...i, qty: Math.max(1, Math.min(MAX_QUANTITY, a.qty)) } : i)) }
    case 'removeItem':
      return { ...state, items: state.items.filter((i) => i.uid !== a.uid) }
    case 'setDescription':
      return { ...state, items: state.items.map((i) => (i.uid === a.uid ? { ...i, description: a.description } : i)) }
    case 'setDistance':
      return { ...state, distance: { km: a.km, source: a.source, durationMin: a.durationMin ?? null } }
    case 'setDate':
      return { ...state, date: a.date, timeSlot: a.date === state.date ? state.timeSlot : '' }
    case 'setSlot':
      return { ...state, timeSlot: a.slot }
    default:
      return state
  }
}

function loadDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
    if (!saved) return null
    const base = emptyBooking()
    return { ...base, ...saved, collection: { ...base.collection, ...saved.collection }, delivery: { ...base.delivery, ...saved.delivery }, distance: { ...base.distance, ...saved.distance }, customer: { ...base.customer, ...saved.customer } }
  } catch {
    return null
  }
}

function validate(stepId, b, { now, distanceStatus }) {
  const e = {}
  if (stepId === 'items') {
    if (!b.items.length) e.items = 'Add at least one item.'
    b.items.forEach((it) => {
      if (itemById[it.id]?.needsDescription && (it.description || '').trim().length < 2) e[`desc-${it.uid}`] = 'Tell us what the item is.'
    })
  }
  if (stepId === 'collection') {
    if (!b.collection.type) e.type = 'Choose where we’re collecting from.'
    if (b.collection.type === 'store' && b.collection.storeName.trim().length < 2) e.storeName = 'Add the store name.'
    if (b.collection.address.trim().length < 3) e.address = 'Add the collection address or suburb.'
  }
  if (stepId === 'delivery') {
    if (b.delivery.address.trim().length < 3) e.address = 'Add the delivery address or suburb.'
    const manual = !mapsEnabled || distanceStatus === 'error'
    const km = Number(b.distance.km)
    if (manual && (b.distance.km === '' || !Number.isFinite(km) || km <= 0 || km > 999)) e.distance = 'Enter a rough distance in km, for example 14.'
    if (!manual && distanceStatus === 'loading') e.distance = 'Still working out the distance.'
    if (b.delivery.contactNumber && !PHONE_RE.test(cleanPhone(b.delivery.contactNumber))) e.contactNumber = 'Enter a valid number, for example 081 234 5678.'
  }
  if (stepId === 'date') {
    if (!b.date) e.date = 'Choose today or tomorrow.'
    else if (b.date === 'later') e.date = 'Quick Book is for today and tomorrow. Use WhatsApp for later dates.'
    else if (!b.timeSlot) e.timeSlot = 'Choose a time slot.'
    else if (!getAvailableSlots(b.date, now).some((s) => s.id === b.timeSlot)) e.timeSlot = 'That slot is no longer available. Choose another.'
  }
  if (stepId === 'customer') {
    if (b.customer.name.trim().length < 2) e.name = 'Please enter your full name.'
    const wa = cleanPhone(b.customer.whatsapp)
    if (!wa) e.whatsapp = 'Please enter your WhatsApp number.'
    else if (!PHONE_RE.test(wa)) e.whatsapp = 'Enter a valid number, for example 081 234 5678.'
    if (b.customer.phone && !PHONE_RE.test(cleanPhone(b.customer.phone))) e.phone = 'Enter a valid number, or leave this empty.'
    if (b.customer.email && !EMAIL_RE.test(b.customer.email.trim())) e.email = 'Enter a valid email address, or leave this empty.'
  }
  return e
}

/**
 * The Quick Book flow: one reusable, multi-step dialog for all four scenarios.
 * Progress is kept for this browser tab (sessionStorage) until the booking is sent.
 */
export default function BookingWizard({ preset, onClose }) {
  const reduce = useReducedMotionSafe()
  const [booking, dispatch] = useReducer(reducer, undefined, () => loadDraft() || emptyBooking())
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [now, setNow] = useState(() => new Date())
  const [distanceState, setDistanceState] = useState({ status: 'idle' })
  const [result, setResult] = useState(null) // { kind: 'saved' | 'whatsapp' | 'error', bookingId, message }
  const [submitting, setSubmitting] = useState(false)
  const dialogRef = useRef(null)
  const headingRef = useRef(null)
  const bodyRef = useRef(null)

  // Apply the preset (scenario / item) the dialog was opened with.
  useEffect(() => {
    if (preset.scenario) dispatch({ type: 'setScenario', scenario: preset.scenario })
    if (preset.itemId) dispatch({ type: 'addItem', id: preset.itemId, onlyIfMissing: true })
  }, [preset])

  // Keep progress for this tab only; clear once the booking has been sent.
  useEffect(() => {
    try {
      if (result && result.kind !== 'error') sessionStorage.removeItem(DRAFT_KEY)
      else sessionStorage.setItem(DRAFT_KEY, JSON.stringify(booking))
    } catch {
      /* storage unavailable: the flow still works */
    }
  }, [booking, result])

  // Slots disappear as the day goes on, so refresh "now" every minute.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  // Google road distance (only when a Maps key is configured).
  const from = booking.collection.address.trim()
  const to = booking.delivery.address.trim()
  useEffect(() => {
    if (!mapsEnabled) return
    if (from.length < 3 || to.length < 3) {
      setDistanceState({ status: 'idle' })
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setDistanceState({ status: 'loading' })
      try {
        const { km, durationMin } = await getRoadDistance(from, to, { signal: controller.signal })
        dispatch({ type: 'setDistance', km: String(km), source: 'google', durationMin })
        setDistanceState({ status: 'done' })
      } catch (err) {
        if (err.name !== 'AbortError') setDistanceState({ status: 'error', code: err.code })
      }
    }, 700)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [from, to])

  // Lock page scroll, focus the dialog title, trap focus, Escape closes.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    headingRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Tab') {
        const f = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="-1"]')].filter((el) => el.getClientRects().length && !(el.type === 'radio' && !el.checked && el.name && dialogRef.current.querySelector(`input[name="${el.name}"]:checked`)))
        const first = f[0]
        const last = f.at(-1)
        if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault()
          first?.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const quote = useMemo(() => calculateQuote(booking), [booking])
  const area = useMemo(() => checkServiceArea(booking), [booking])
  const message = useMemo(() => buildBookingMessage(booking, { quote, now, bookingId: result?.bookingId }), [booking, quote, now, result])
  const stepId = STEPS[step].id
  const outside = !area.inside || quote.status === 'over'

  const goTo = useCallback((i) => {
    setStep(i)
    setErrors({})
    bodyRef.current?.scrollTo({ top: 0 })
    requestAnimationFrame(() => headingRef.current?.focus())
  }, [])

  const next = () => {
    const e = validate(stepId, booking, { now, distanceStatus: distanceState.status })
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => dialogRef.current?.querySelector('[aria-invalid="true"], .text-danger')?.scrollIntoView({ block: 'center' }))
      const firstInvalid = dialogRef.current?.querySelector('[aria-invalid="true"]')
      firstInvalid?.focus()
      return
    }
    // Outside the Quick Book area: skip to the last step, which offers WhatsApp
    // with everything entered so far (the customer is never turned away).
    if (stepId === 'delivery' && outside) return goTo(STEPS.length - 1)
    goTo(Math.min(step + 1, STEPS.length - 1))
  }

  const book = async () => {
    // Re-check every step before booking.
    for (let i = 0; i < STEPS.length - 1; i++) {
      const e = validate(STEPS[i].id, booking, { now, distanceStatus: distanceState.status })
      if (Object.keys(e).length) {
        goTo(i)
        setErrors(e)
        return
      }
    }
    const bookingId = createBookingId()
    const record = createBookingRecord(booking, quote, { bookingId })
    const msg = buildBookingMessage(booking, { quote, now, bookingId })
    if (!bookingBackend) {
      // No booking database yet: the booking is sent to the team on WhatsApp.
      window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer')
      setResult({ kind: 'whatsapp', bookingId, message: msg })
      return
    }
    setSubmitting(true)
    try {
      await submitBooking(record)
      setResult({ kind: 'saved', bookingId, message: msg })
    } catch {
      setResult({ kind: 'error', bookingId, message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const startOver = () => {
    dispatch({ type: 'reset' })
    setResult(null)
    setDistanceState({ status: 'idle' })
    goTo(0)
  }

  const total = quoteTotalLabel(quote)
  const stepProps = { booking, dispatch, errors, now, whatsappMessage: message, distanceState }

  const body = result ? (
    <ResultPanel result={result} onStartOver={startOver} onClose={onClose} />
  ) : (
    <>
      {step === 0 && (
        <div className="mb-6">
          <ScenarioSelect value={booking.scenario} onChange={(s) => dispatch({ type: 'setScenario', scenario: s })} />
        </div>
      )}
      {stepId === 'items' && <ItemSelector {...stepProps} />}
      {stepId === 'collection' && <CollectionDetails {...stepProps} />}
      {stepId === 'delivery' && <DeliveryDetails {...stepProps} />}
      {stepId === 'date' && <DateSelector {...stepProps} />}
      {stepId === 'customer' && <CustomerDetails {...stepProps} />}
      {stepId === 'quote' && <QuoteSummary booking={booking} quote={quote} area={area} now={now} whatsappMessage={message} />}
    </>
  )

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-black/60 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qb-title"
        aria-describedby="qb-step-title"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-dvh w-full flex-col bg-white sm:h-auto sm:max-h-[min(92dvh,56rem)] sm:max-w-3xl sm:rounded-3xl sm:shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-line px-4 pt-4 pb-3 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Quick Book</p>
              <h2 id="qb-title" className="sr-only">Quick Book a delivery</h2>
              <h3 id="qb-step-title" ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-bold outline-none sm:text-2xl">
                {result ? (result.kind === 'error' ? 'Booking not saved' : 'Booking sent') : STEPS[step].title}
              </h3>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Quick Book" className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface">
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
          {!result && (
            <div className="mt-3">
              <p className="text-sm text-muted">Step {step + 1} of {STEPS.length}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Booking progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
                <div className="h-full rounded-full bg-brand-yellow transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">{body}</div>

        {/* Sticky footer: estimate, WhatsApp, navigation */}
        {!result && (
          <div className="border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <p className="text-sm text-muted" aria-live="polite">
                {total && !outside ? (
                  <>Estimate: <strong className="rounded bg-brand-yellow px-1.5 text-base text-brand-black">{total}</strong></>
                ) : (
                  'Estimate shown once we know the distance'
                )}
              </p>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-black underline decoration-whatsapp decoration-[3px] underline-offset-4"
              >
                <WhatsAppIcon className="size-4" />
                Continue on WhatsApp
              </a>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => goTo(step - 1)} className="!px-4" aria-label="Back to previous step">
                  <ArrowLeft className="size-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              {stepId !== 'quote' ? (
                <Button variant="dark" onClick={next} className="flex-1" disabled={stepId === 'date' && booking.date === 'later'}>
                  Next
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Button>
              ) : outside ? (
                <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="flex-1">
                  <WhatsAppIcon />
                  Ask on WhatsApp
                </Button>
              ) : (
                <>
                  <Button variant="dark" onClick={book} disabled={submitting} aria-busy={submitting} className="flex-1">
                    {submitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <CalendarCheck className="size-5" aria-hidden="true" />}
                    {submitting ? 'Booking…' : 'Book This Delivery'}
                  </Button>
                  {/* Desktop only; on phones the WhatsApp link sits just above. */}
                  <div className="hidden flex-1 sm:flex">
                    <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="w-full">
                      <WhatsAppIcon />
                      Continue on WhatsApp
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
  )
}

function ResultPanel({ result, onStartOver, onClose }) {
  const link = whatsappLink(result.message)
  if (result.kind === 'error') {
    return (
      <div className="rounded-2xl border border-danger/40 bg-danger/5 p-5" role="alert">
        <p className="flex items-center gap-2 font-semibold text-danger">
          <CircleAlert className="size-5" aria-hidden="true" /> Sorry, we couldn’t save your booking.
        </p>
        <p className="mt-2 text-ink">Send it to us on WhatsApp instead. Everything you entered is already filled in.</p>
        <Button href={link} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="mt-4 w-full sm:w-auto">
          <WhatsAppIcon />
          Send on WhatsApp
        </Button>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-success/40 bg-success/5 p-6 text-center" role="status">
      <CircleCheck className="mx-auto size-12 text-success" aria-hidden="true" />
      <p className="mt-3 text-xl font-bold text-brand-black">
        {result.kind === 'saved' ? 'Booking received' : 'Your booking is ready in WhatsApp'}
      </p>
      <p className="mt-1 text-sm text-muted">Reference: <strong className="text-brand-black">{result.bookingId}</strong></p>
      <p className="mx-auto mt-3 max-w-md text-muted">
        {result.kind === 'saved'
          ? 'We’ll confirm availability and your final quote on WhatsApp before collection.'
          : 'Press send in WhatsApp and we’ll confirm availability and your final quote. If WhatsApp didn’t open, use the button below.'}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href={link} target="_blank" rel="noopener noreferrer" variant="whatsapp">
          <WhatsAppIcon />
          {result.kind === 'saved' ? 'Chat on WhatsApp' : 'Open WhatsApp again'}
        </Button>
        <Button variant="outline" onClick={onStartOver}>
          <RotateCcw className="size-5" aria-hidden="true" />
          New booking
        </Button>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
