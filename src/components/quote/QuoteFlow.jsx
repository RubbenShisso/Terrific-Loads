import { useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Info, LoaderCircle, Plus, Route, X } from 'lucide-react'
import Field from '../forms/Field.jsx'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'
import AddressField from './AddressField.jsx'
import ItemPicker from './ItemPicker.jsx'
import { useRouteDistance } from '../../hooks/useRouteDistance.js'
import { whatsappLink } from '../../config/business.js'
import { itemById, MAX_QUANTITY } from '../../config/items.js'
import { rates, formatRand } from '../../config/rates.js'
import { isValidPhone } from '../../lib/phone.js'
import {
  QUOTE_EVENTS,
  extraStops as extraStopRules,
  deliveryOptions,
  optionById,
  quoteOutcome,
  optionPrice,
  resolveDate,
  todayISO,
  addDaysISO,
  shortDate,
  routeDistanceText,
  buildQuoteMessage,
} from '../../config/quote.js'

const STEPS = [
  { id: 'items', title: 'What do you need delivered?' },
  { id: 'addresses', title: 'Where are we collecting and delivering?' },
  { id: 'option', title: 'Choose your delivery option' },
  { id: 'details', title: 'Your details' },
]
const DRAFT_KEY = 'tl-quote-draft'
const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const emptyAddress = () => ({ text: '', commit: null, what: '' })

const initialState = {
  items: [],
  collection: emptyAddress(),
  delivery: emptyAddress(),
  multi: false,
  extras: [],
  option: '',
  dateChoice: '',
  otherDate: '',
  name: '',
  phone: '',
  notes: '',
}

function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return { ...initialState, ...a.state }
    case 'addItem': {
      const meta = itemById[a.id]
      if (!meta) return state
      // "Other" always adds a new row (each needs its own description); others add one more.
      const existing = !meta.needsDescription && state.items.find((it) => it.id === a.id)
      if (existing) {
        if (a.onlyIfMissing) return state
        return { ...state, items: state.items.map((it) => (it === existing ? { ...it, qty: Math.min(MAX_QUANTITY, it.qty + 1) } : it)) }
      }
      return { ...state, items: [...state.items, { uid: a.uid, id: a.id, qty: 1, description: '' }] }
    }
    case 'qty':
      return { ...state, items: state.items.map((it) => (it.uid === a.uid ? { ...it, qty: Math.max(1, Math.min(MAX_QUANTITY, a.qty)) } : it)) }
    case 'removeItem':
      return { ...state, items: state.items.filter((it) => it.uid !== a.uid) }
    case 'describe':
      return { ...state, items: state.items.map((it) => (it.uid === a.uid ? { ...it, description: a.value } : it)) }
    case 'address':
      return { ...state, [a.which]: { ...state[a.which], ...a.patch } }
    case 'multi':
      return { ...state, multi: a.value, extras: a.value && !state.extras.length ? [{ id: a.uid, kind: 'collect', ...emptyAddress() }] : state.extras }
    case 'addExtra':
      return state.extras.length >= extraStopRules.max ? state : { ...state, extras: [...state.extras, { id: a.uid, kind: 'deliver', ...emptyAddress() }] }
    case 'extra':
      return { ...state, extras: state.extras.map((s) => (s.id === a.id ? { ...s, ...a.patch } : s)) }
    case 'removeExtra': {
      const extras = state.extras.filter((s) => s.id !== a.id)
      return { ...state, extras, multi: extras.length ? state.multi : false }
    }
    case 'set':
      return { ...state, [a.field]: a.value }
    default:
      return state
  }
}

function validate(stepId, s, { now }) {
  const e = {}
  if (stepId === 'items') {
    if (!s.items.length) e.items = 'Add at least one item.'
    s.items.forEach((it) => {
      if (itemById[it.id]?.needsDescription && it.description.trim().length < 2) e[`desc-${it.uid}`] = 'Tell us what the item is.'
    })
  }
  if (stepId === 'addresses') {
    if (s.collection.text.trim().length < 3) e.collection = 'Add the collection address.'
    if (s.delivery.text.trim().length < 3) e.delivery = 'Add the delivery address.'
    if (s.multi) {
      s.extras.forEach((x) => {
        if (x.text.trim().length < 3) e[`extra-${x.id}`] = 'Add the address for this stop.'
        if (x.what.trim().length < 2) e[`what-${x.id}`] = x.kind === 'collect' ? 'Tell us what we’re collecting here.' : 'Tell us what we’re delivering here.'
      })
    }
  }
  if (stepId === 'option') {
    if (!s.option) e.option = 'Choose a delivery option.'
  }
  if (stepId === 'details') {
    const option = optionById[s.option]
    if (option && option.dates.length > 1) {
      if (!s.dateChoice || !option.dates.includes(s.dateChoice)) e.date = 'Choose your preferred date.'
      else if (s.dateChoice === 'other') {
        const min = addDaysISO(todayISO(now), 1)
        if (!s.otherDate) e.date = 'Pick a date.'
        else if (s.otherDate < min) e.date = 'Pick a date from tomorrow onwards.'
      }
    }
    if (s.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!s.phone.trim()) e.phone = 'Please enter your contact number.'
    else if (!isValidPhone(s.phone)) e.phone = 'Enter a valid number, for example 081 234 5678.'
  }
  return e
}

/**
 * The quote flow: items -> addresses and stops -> delivery option -> details -> WhatsApp.
 * Prices are shown only for one item on a single route whose driving distance
 * could be worked out (see quoteOutcome in src/config/quote.js).
 */
export default function QuoteFlow({ id = 'get-a-quote', title = 'Get a delivery quote' }) {
  const uid = useId()
  const rootRef = useRef(null)
  const headingRef = useRef(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const loaded = useRef(false)
  const moved = useRef(false)

  // Restore this tab's draft, then apply any ?item= from a "Get a quote" link.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
      if (saved && typeof saved === 'object') dispatch({ type: 'load', state: saved })
    } catch { /* storage blocked: start fresh */ }
    loaded.current = true
    const item = new URLSearchParams(window.location.search).get('item')
    if (item && itemById[item]) dispatch({ type: 'addItem', id: item, uid: newId(), onlyIfMissing: true })
  }, [])
  useEffect(() => {
    if (!loaded.current) return
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const goTo = useCallback((i) => {
    moved.current = true
    setErrors({})
    setStep(i)
  }, [])

  // Other parts of the page: "Get a quote" on an item, and the "Where we deliver" chips.
  useEffect(() => {
    const scrollHere = () => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const onItem = (e) => {
      dispatch({ type: 'addItem', id: e.detail, uid: newId(), onlyIfMissing: true })
      goTo(0)
      scrollHere()
    }
    const onArea = (e) => {
      dispatch({ type: 'address', which: 'delivery', patch: { text: e.detail, commit: { text: e.detail } } })
      scrollHere()
    }
    window.addEventListener(QUOTE_EVENTS.addItem, onItem)
    window.addEventListener(QUOTE_EVENTS.setDelivery, onArea)
    return () => {
      window.removeEventListener(QUOTE_EVENTS.addItem, onItem)
      window.removeEventListener(QUOTE_EVENTS.setDelivery, onArea)
    }
  }, [goTo])

  // After moving between steps: keep the form in view and put focus on the step title.
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) rootRef.current.scrollIntoView({ block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  // Keep "today" correct if the page is left open past midnight.
  useEffect(() => {
    if (step === 3) setNow(new Date())
  }, [step])

  // ---- Route and price ----
  const stopList = useMemo(() => {
    const list = [{ role: 'collection', ...state.collection }]
    if (state.multi) state.extras.forEach((x) => list.push({ role: x.kind, ...x }))
    list.push({ role: 'delivery', ...state.delivery })
    return list
  }, [state.collection, state.delivery, state.multi, state.extras])
  const ready = Boolean(state.collection.commit?.text && state.delivery.commit?.text)
  const routeStops = ready ? stopList.filter((s) => s.commit?.text).map((s) => s.commit) : []
  const route = useRouteDistance(routeStops)
  const routeRoles = ready ? stopList.filter((s) => s.commit?.text) : []
  const hasExtraStops = state.multi && state.extras.some((x) => x.text.trim())
  const outcome = quoteOutcome({ items: state.items, hasExtraStops, route })
  const option = optionById[state.option]
  const date = resolveDate(option, state.dateChoice, state.otherDate, now)

  const message = buildQuoteMessage({
    items: state.items,
    stops: stopList.map((s) => ({ role: s.role, address: s.text, what: state.multi ? s.what : '' })),
    route,
    outcome,
    option,
    date,
    name: state.name,
    phone: state.phone,
    notes: state.notes,
    now,
  })

  const next = () => {
    const e = validate(STEPS[step].id, state, { now })
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => rootRef.current?.querySelector('[aria-invalid="true"], [data-error]')?.focus())
      return
    }
    goTo(step + 1)
  }

  const send = (ev) => {
    const e = validate('details', state, { now })
    setErrors(e)
    if (Object.keys(e).length) {
      ev.preventDefault()
      requestAnimationFrame(() => rootRef.current?.querySelector('[aria-invalid="true"], [data-error]')?.focus())
      return
    }
    setSent(true)
  }

  const setAddress = (which) => ({
    onText: (text) => dispatch({ type: 'address', which, patch: { text } }),
    onCommit: (commit) => dispatch({ type: 'address', which, patch: { commit } }),
  })
  const stepId = STEPS[step].id
  const fid = (name) => `${uid}-${name}`

  return (
    <section id={id} ref={rootRef} aria-labelledby={`${uid}-title`} className="scroll-mt-24 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-8">
      <p className="eyebrow">Delivery quote</p>
      <h2 id={`${uid}-title`} className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-muted">
        Tell us what you bought and where it’s going. We’re a collection and delivery service. We don’t sell furniture.
      </p>

      {/* Progress */}
      <div className="mt-6">
        <p className="text-sm font-medium text-muted">Step {step + 1} of {STEPS.length}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-brand-yellow transition-[width] duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-xl font-bold text-brand-black focus:outline-none sm:text-2xl">
        {STEPS[step].title}
      </h3>

      <div className="mt-5">
        {stepId === 'items' && (
          <ItemPicker
            idPrefix={uid}
            list={state.items}
            errors={errors}
            onAdd={(itemId) => dispatch({ type: 'addItem', id: itemId, uid: newId() })}
            onQty={(u, qty) => dispatch({ type: 'qty', uid: u, qty })}
            onRemove={(u) => dispatch({ type: 'removeItem', uid: u })}
            onDescribe={(u, value) => dispatch({ type: 'describe', uid: u, value })}
          />
        )}

        {stepId === 'addresses' && (
          <div className="space-y-5">
            <AddressField
              id={fid('collection')}
              label={state.multi ? 'Collection address (first stop)' : 'Collection address'}
              hint="The store, seller or address where we collect."
              placeholder="e.g. Coricraft, Tyger Valley"
              value={state.collection.text}
              commit={state.collection.commit}
              error={errors.collection}
              {...setAddress('collection')}
            />
            {state.multi && (
              <Field
                id={fid('collection-what')}
                label="What are we collecting here?"
                optional
                placeholder="e.g. the couch"
                value={state.collection.what}
                onChange={(e) => dispatch({ type: 'address', which: 'collection', patch: { what: e.target.value } })}
              />
            )}
            <AddressField
              id={fid('delivery')}
              label={state.multi ? 'Final delivery address (last stop)' : 'Delivery address'}
              hint="Where it’s going."
              placeholder="e.g. 12 Main Road, Durbanville"
              value={state.delivery.text}
              commit={state.delivery.commit}
              error={errors.delivery}
              {...setAddress('delivery')}
            />
            {state.multi && (
              <Field
                id={fid('delivery-what')}
                label="What are we delivering here?"
                optional
                placeholder="e.g. everything else"
                value={state.delivery.what}
                onChange={(e) => dispatch({ type: 'address', which: 'delivery', patch: { what: e.target.value } })}
              />
            )}

            <fieldset>
              <legend className="font-semibold text-brand-black">Do you need us to collect from or deliver to more than one location?</legend>
              <div className="mt-3 flex gap-2">
                {[['No', false], ['Yes', true]].map(([label, value]) => (
                  <label key={label} className="chip min-w-20 justify-center">
                    <input
                      type="radio"
                      name={fid('multi')}
                      className="sr-only"
                      checked={state.multi === value}
                      onChange={() => dispatch({ type: 'multi', value, uid: newId() })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            {state.multi && (
              <ExtraStops
                extras={state.extras}
                errors={errors}
                fid={fid}
                dispatch={dispatch}
              />
            )}

            <RouteLine route={route} multi={hasExtraStops} roles={routeRoles} />
          </div>
        )}

        {stepId === 'option' && (
          <OptionStep state={state} dispatch={dispatch} route={route} outcome={outcome} roles={routeRoles} multi={hasExtraStops} error={errors.option} fid={fid} />
        )}

        {stepId === 'details' && (
          <DetailsStep state={state} dispatch={dispatch} option={option} errors={errors} fid={fid} now={now} message={message} />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 font-semibold text-brand-black hover:border-brand-black"
          >
            <ArrowLeft className="size-5" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        {stepId !== 'details' ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-black px-6 font-semibold text-brand-yellow hover:bg-ink"
          >
            Next <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        ) : (
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={send}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 text-center font-bold tracking-wide text-brand-black uppercase shadow-sm hover:brightness-95"
          >
            <WhatsAppIcon />
            Get a delivery quote on WhatsApp
          </a>
        )}
      </div>
      {stepId === 'details' && (
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {sent
            ? 'WhatsApp should now be open with your details filled in. Press send there, and we’ll reply to confirm the price and availability.'
            : 'This opens WhatsApp with your details filled in. Nothing is booked yet: we confirm the job and price on WhatsApp first, then a 50% deposit secures your booking and the rest is paid before delivery.'}
        </p>
      )}
    </section>
  )
}

/** Extra stops between the collection and the final delivery address. */
function ExtraStops({ extras, errors, fid, dispatch }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        We go to the collection address first, then these stops in this order, then the final delivery address.
      </p>
      <ol className="space-y-4">
        {extras.map((x, i) => (
          <li key={x.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-brand-black">Stop {i + 2}</p>
              <button
                type="button"
                onClick={() => dispatch({ type: 'removeExtra', id: x.id })}
                aria-label={`Remove stop ${i + 2}`}
                className="grid size-11 place-items-center rounded-xl text-muted hover:bg-white hover:text-danger"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <fieldset className="mt-2">
              <legend className="sr-only">What happens at stop {i + 2}?</legend>
              <div className="flex flex-wrap gap-2">
                {[['collect', 'Collect from here'], ['deliver', 'Deliver here']].map(([kind, label]) => (
                  <label key={kind} className="chip">
                    <input
                      type="radio"
                      name={fid(`kind-${x.id}`)}
                      className="sr-only"
                      checked={x.kind === kind}
                      onChange={() => dispatch({ type: 'extra', id: x.id, patch: { kind } })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-4 space-y-4">
              <AddressField
                id={fid(`extra-${x.id}`)}
                label={`Stop ${i + 2} address`}
                placeholder="e.g. Weylandts, Canal Walk"
                value={x.text}
                commit={x.commit}
                error={errors[`extra-${x.id}`]}
                onText={(text) => dispatch({ type: 'extra', id: x.id, patch: { text } })}
                onCommit={(commit) => dispatch({ type: 'extra', id: x.id, patch: { commit } })}
              />
              <Field
                id={fid(`what-${x.id}`)}
                label={x.kind === 'collect' ? 'What are we collecting here?' : 'What are we delivering here?'}
                placeholder={x.kind === 'collect' ? 'e.g. collect the table' : 'e.g. deliver the chairs'}
                value={x.what}
                onChange={(e) => dispatch({ type: 'extra', id: x.id, patch: { what: e.target.value } })}
                error={errors[`what-${x.id}`]}
              />
            </div>
          </li>
        ))}
      </ol>
      {extras.length < extraStopRules.max ? (
        <button
          type="button"
          onClick={() => dispatch({ type: 'addExtra', uid: newId() })}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-brand-black hover:border-brand-black"
        >
          <Plus className="size-4" aria-hidden="true" /> Add another stop
        </button>
      ) : (
        <p className="text-sm text-muted">That’s the most stops we can take here. Add any others in your notes or on WhatsApp.</p>
      )}
    </div>
  )
}

const roleName = (role, index) => {
  if (role === 'collection') return 'collection'
  if (role === 'delivery') return 'delivery'
  return `stop ${index + 1}`
}

/** Driving distance status, shown under the addresses and on the options step. */
function RouteLine({ route, multi, roles }) {
  let icon = <Route className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
  let body = null
  if (route.status === 'loading') {
    icon = <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin" aria-hidden="true" />
    body = 'Working out the driving distance…'
  } else if (route.status === 'not-found') {
    icon = <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    body = `We couldn’t find the ${roleName(roles[route.missing]?.role, route.missing)} address. Try picking one of the suggestions.`
  } else if (route.status === 'error') {
    icon = <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    body = 'We couldn’t work out the driving route right now.'
  } else if (route.status === 'done') {
    body = (
      <>
        <strong className="font-semibold">Driving distance: </strong>
        {routeDistanceText(route)}
        {route.minutes ? ` (about ${route.minutes} min)` : ''}
        {multi ? ', through all stops' : ''}.
      </>
    )
  }
  return (
    <p className="flex min-h-6 items-start gap-2 text-sm text-ink" aria-live="polite">
      {body && (
        <>
          {icon}
          <span>{body}</span>
        </>
      )}
    </p>
  )
}

const reasonText = {
  'multiple-stops': 'Jobs with more than one stop are priced by our team. Send us the details and we’ll confirm your price on WhatsApp before you pay anything.',
  'multiple-items': 'Our prices cover one straightforward item. You’ve added more than one, so we’ll confirm your price on WhatsApp before you pay anything.',
  'not-found': 'We couldn’t find one of the addresses, so we won’t show a price that might be wrong. Go back and pick a suggestion, or send us the details for a quote on WhatsApp.',
  'no-route': 'We couldn’t work out the driving route right now, so we won’t show a price that might be wrong. Send us the details and we’ll quote you on WhatsApp.',
  over: `This route is longer than our ${rates.maxPricedKm} km standard service distance. Send us the details and we’ll quote you on WhatsApp.`,
  incomplete: 'Send us the details and we’ll quote you on WhatsApp.',
}

/** Step 3: route, indicative prices (when allowed) and the delivery option. */
function OptionStep({ state, dispatch, route, outcome, roles, multi, error, fid }) {
  const pending = outcome.reason === 'pending'
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line bg-surface p-4">
        <RouteLine route={route} multi={multi} roles={roles} />
        {!outcome.priced && !pending && <p className="mt-2 text-sm text-ink">{reasonText[outcome.reason]}</p>}
        {outcome.priced && <p className="mt-2 text-sm text-muted">{rates.note}</p>}
      </div>

      <fieldset>
        <legend className="font-semibold text-brand-black">How would you like it delivered?</legend>
        {error && <p className="mt-2 text-sm font-medium text-danger" tabIndex={-1} data-error="">{error}</p>}
        <div className="mt-3 grid gap-3">
          {deliveryOptions.map((o) => {
            const price = optionPrice(o, outcome)
            const checked = state.option === o.id
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${checked ? 'border-brand-black bg-brand-yellow/15 ring-2 ring-brand-black' : 'border-line bg-white hover:border-brand-black'}`}
              >
                <input
                  type="radio"
                  name={fid('option')}
                  value={o.id}
                  checked={checked}
                  onChange={() => dispatch({ type: 'set', field: 'option', value: o.id })}
                  className="mt-1 size-5 shrink-0 accent-brand-black"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-lg font-bold text-brand-black">{o.label}</span>
                    <OptionPrice price={price} option={o} pending={pending} />
                  </span>
                  <span className="mt-1 block text-sm text-muted">{o.text}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

function OptionPrice({ price, option, pending }) {
  if (price != null) {
    return (
      <span className="text-right">
        <span className="rounded-md bg-brand-yellow px-1.5 text-xl font-extrabold text-brand-black tabular-nums">{formatRand(price)}</span>
        <span className="ml-1 text-xs text-muted">indicative</span>
      </span>
    )
  }
  if (pending && option.price) return <LoaderCircle className="size-5 animate-spin text-muted" aria-label="Working out the price" />
  return <span className="text-sm font-semibold text-ink">{option.price ? 'Price on WhatsApp' : 'Ask us on WhatsApp'}</span>
}

/** Step 4: date, name, number, notes, and the message preview. */
function DetailsStep({ state, dispatch, option, errors, fid, now, message }) {
  const today = todayISO(now)
  const tomorrow = addDaysISO(today, 1)
  const set = (field) => (e) => dispatch({ type: 'set', field, value: e.target.value })
  const choices = { today: `Today (${shortDate(today)})`, tomorrow: `Tomorrow (${shortDate(tomorrow)})`, other: 'Another date' }
  return (
    <div className="space-y-5">
      {option && option.dates.length === 1 ? (
        <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-ink">
          <strong className="font-semibold">{option.label}</strong> is for today, {shortDate(today)}.
        </p>
      ) : (
        option && (
          <fieldset>
            <legend className="font-semibold text-brand-black">Preferred delivery date</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {option.dates.map((d) => (
                <label key={d} className="chip">
                  <input type="radio" name={fid('date')} className="sr-only" checked={state.dateChoice === d} onChange={() => dispatch({ type: 'set', field: 'dateChoice', value: d })} />
                  {choices[d]}
                </label>
              ))}
            </div>
            {state.dateChoice === 'other' && (
              <div className="mt-3 max-w-xs">
                <Field id={fid('other-date')} type="date" label="Date" min={tomorrow} value={state.otherDate} onChange={set('otherDate')} />
              </div>
            )}
            {errors.date && <p className="mt-2 text-sm font-medium text-danger" tabIndex={-1} data-error="">{errors.date}</p>}
            <p className="mt-2 text-sm text-muted">We agree the delivery time with you on WhatsApp.</p>
          </fieldset>
        )
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fid('name')} label="Your name" autoComplete="name" value={state.name} onChange={set('name')} error={errors.name} />
        <Field id={fid('phone')} type="tel" inputMode="tel" autoComplete="tel" label="Contact number" placeholder="e.g. 081 234 5678" value={state.phone} onChange={set('phone')} error={errors.phone} />
      </div>
      <Field
        id={fid('notes')}
        as="textarea"
        rows={3}
        label="Notes"
        optional
        hint="Access, stairs, item size or anything that needs special handling."
        placeholder="e.g. 2nd floor, no lift. The couch is 2.4 m long."
        value={state.notes}
        onChange={set('notes')}
      />

      <details className="rounded-2xl border border-line bg-surface p-4">
        <summary className="cursor-pointer font-semibold text-brand-black">See the message we’ll send</summary>
        <p className="mt-3 text-sm whitespace-pre-line text-ink">{message}</p>
      </details>
    </div>
  )
}
