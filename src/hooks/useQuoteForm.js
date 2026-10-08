import { useEffect, useState } from 'react'
import { submitForm } from '../services/formService.js'
import { whatsappLink } from '../config/business.js'

export const WHEN_OPTIONS = [
  { value: 'today', label: 'Today (same-day)' },
  { value: 'tomorrow', label: 'Tomorrow (next-day)' },
  { value: 'date', label: 'Another date' },
  { value: 'flexible', label: 'I’m flexible' },
]

const initial = {
  name: '',
  phone: '',
  collectionAddress: '',
  deliveryAddress: '',
  items: '',
  dimensions: '',
  when: '',
  date: '',
  notes: '',
  company: '', // honeypot, must stay empty
}

const PHONE_RE = /^\+?\d{9,15}$/

// Draft kept for this browser tab only (sessionStorage), so a refresh doesn't
// lose what was typed. Cleared on successful send; never stored permanently.
const DRAFT_KEY = 'tl-quote-draft'
function loadDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
    return saved ? { ...initial, ...saved, company: '' } : initial
  } catch {
    return initial
  }
}
function saveDraft(values) {
  try {
    const { company, ...rest } = values
    if (Object.values(rest).some((v) => v)) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // Storage unavailable (private mode etc.): the form still works.
  }
}
function clearDraft() {
  try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

export function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  const phone = v.phone.replace(/[\s\-()]/g, '')
  if (!phone) e.phone = 'Please enter your WhatsApp or phone number.'
  else if (!PHONE_RE.test(phone)) e.phone = 'Enter a valid number, for example 081 234 5678.'
  if (v.collectionAddress.trim().length < 3) e.collectionAddress = 'Where should we collect from? Add the store name or address.'
  if (v.deliveryAddress.trim().length < 3) e.deliveryAddress = 'Where should we deliver to? Add the address or suburb.'
  if (v.items.trim().length < 3) e.items = 'Tell us what needs collecting, for example a fridge.'
  if (!v.when) e.when = 'Choose your preferred delivery date.'
  else if (v.when === 'date' && !v.date) e.date = 'Choose a date.'
  return e
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** "2026-10-09" -> "Fri 9 October 2026". Built by hand so it reads the same on every phone. */
function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  return `${DAYS[date.getDay()]} ${d} ${MONTHS[m - 1]} ${y}`
}

export function whenLabel(v) {
  if (v.when === 'date') return v.date ? formatDate(v.date) : ''
  return WHEN_OPTIONS.find((o) => o.value === v.when)?.label ?? ''
}

/** The pre-filled WhatsApp quote message. Optional lines are left out when empty. */
export function summarise(v) {
  const line = (label, value) => (value && value.trim() ? `${label}: ${value.trim()}` : null)
  return [
    "Hi Terrific Loads, I'd like a delivery quote.",
    '',
    line('Item', v.items),
    line('Dimensions', v.dimensions),
    line('Collection', v.collectionAddress),
    line('Delivery', v.deliveryAddress),
    line('Preferred date', whenLabel(v)),
    line('Name', v.name),
    line('Contact number', v.phone),
    line('Notes', v.notes),
    '',
    'Please confirm availability and pricing.',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export default function useQuoteForm() {
  const [values, setValues] = useState(initial)
  const [draftLoaded, setDraftLoaded] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [sentVia, setSentVia] = useState(null) // 'whatsapp' | 'form'
  const [errorCode, setErrorCode] = useState(null)

  // Restore the draft after mount (the page HTML is prerendered without it).
  useEffect(() => {
    setValues(loadDraft())
    setDraftLoaded(true)
  }, [])

  useEffect(() => {
    if (draftLoaded && status !== 'success') saveDraft(values)
  }, [values, status, draftLoaded])

  const onChange = (e) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name]) setErrors(validate(next))
  }

  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
    setErrors(validate(values))
  }

  // Two submit buttons: WhatsApp (default, also used by the Enter key) and,
  // when an endpoint is configured, the email/form service.
  const onSubmit = async (e) => {
    e.preventDefault()
    const via = e.nativeEvent?.submitter?.value === 'form' ? 'form' : 'whatsapp'
    const found = validate(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(initial).map((k) => [k, true])))
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(`quote-${first}`)?.focus()
      return
    }
    if (values.company) {
      // Bot filled the honeypot: pretend success, send nothing.
      setSentVia(via)
      setStatus('success')
      return
    }

    if (via === 'whatsapp') {
      // Opened synchronously inside the submit handler so browsers allow it.
      window.open(whatsappLink(summarise(values)), '_blank', 'noopener,noreferrer')
      clearDraft()
      setSentVia('whatsapp')
      setStatus('success')
      return
    }

    setStatus('submitting')
    setErrorCode(null)
    try {
      const { company, ...payload } = values
      await submitForm({ ...payload, when: whenLabel(values) })
      clearDraft()
      setSentVia('form')
      setStatus('success')
    } catch (err) {
      setErrorCode(err.code ?? 'unknown')
      setStatus('error')
    }
  }

  const reset = () => {
    clearDraft()
    setValues(initial)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setSentVia(null)
    setErrorCode(null)
  }

  return { values, errors, touched, status, sentVia, errorCode, onChange, onBlur, onSubmit, reset }
}
