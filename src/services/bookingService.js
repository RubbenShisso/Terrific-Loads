/**
 * Quick Book booking submission. Optional: with no backend configured the
 * site still works, and "Book this delivery" sends the booking on WhatsApp.
 *
 * Backends, first match wins:
 *   1. Firestore (no SDK needed, uses the REST API):
 *        VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_API_KEY
 *        Writes to the `bookings` collection. Firestore security rules must
 *        allow `create` on bookings (and nothing else) for this to work.
 *   2. Any JSON endpoint: VITE_BOOKING_ENDPOINT, or the quote form's VITE_FORM_ENDPOINT.
 */
import { submitForm, FormServiceError } from './formService.js'
import { itemById } from '../config/items.js'
import { schedule, slotLabel } from '../config/timeSlots.js'
import { getQuickBookDays } from '../lib/availability.js'

const env = import.meta.env
const firestore = env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_API_KEY
  ? { projectId: env.VITE_FIREBASE_PROJECT_ID, apiKey: env.VITE_FIREBASE_API_KEY }
  : null
const endpoint = env.VITE_BOOKING_ENDPOINT || env.VITE_FORM_ENDPOINT || null

export const bookingBackend = firestore ? 'firestore' : endpoint ? 'endpoint' : null
export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

/** Short, readable reference such as TL-261009-K7Q2. */
export function createBookingId(now = new Date()) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('')
  return `TL-${d}-${rand}`
}

/** The stored booking record (field names agreed for the admin side). */
export function createBookingRecord(booking, quote, { bookingId, now = new Date() } = {}) {
  const days = getQuickBookDays(now)
  const slot = schedule.slots.find((s) => s.id === booking.timeSlot)
  return {
    bookingId,
    createdAt: now.toISOString(),
    status: 'pending',
    scenario: booking.scenario,
    items: booking.items.map((it) => ({
      id: it.id,
      label: itemById[it.id]?.label || it.id,
      qty: Math.max(1, Number(it.qty) || 1),
      description: it.description?.trim() || '',
    })),
    collection: {
      type: booking.collection.type,
      storeName: booking.collection.storeName?.trim() || '',
      address: booking.collection.address.trim(),
      contactName: booking.collection.contactName?.trim() || '',
      notes: booking.collection.notes?.trim() || '',
    },
    delivery: {
      address: booking.delivery.address.trim(),
      contactName: booking.delivery.contactName?.trim() || '',
      contactNumber: booking.delivery.contactNumber?.trim() || '',
      propertyType: booking.delivery.propertyType || '',
      stairs: Boolean(booking.delivery.stairs),
      access: booking.delivery.access?.trim() || '',
      notes: booking.delivery.notes?.trim() || '',
    },
    distanceKm: Number(booking.distance.km) || null,
    distanceSource: booking.distance.source || 'manual',
    travelDuration: booking.distance.durationMin ?? null,
    date: booking.date === 'today' ? days.today.iso : booking.date === 'tomorrow' ? days.tomorrow.iso : null,
    timeSlot: slot ? slotLabel(slot) : null,
    customer: {
      name: booking.customer.name.trim(),
      whatsapp: booking.customer.whatsapp.trim(),
      phone: booking.customer.phone?.trim() || '',
      email: booking.customer.email?.trim() || '',
    },
    quote: quote?.status === 'ok'
      ? { total: quote.total, isFrom: quote.isFrom, lines: quote.lines, pending: quote.pending }
      : null,
    source: 'website-quick-book',
  }
}

/** Plain JS value -> Firestore REST "Value". */
export function toFirestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (typeof v === 'string') return { stringValue: v }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFirestoreValue) } }
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toFirestoreValue(x)])) } }
}

async function saveToFirestore(record) {
  const { projectId, apiKey } = firestore
  const fields = toFirestoreValue(record).mapValue.fields
  fields.createdAt = { timestampValue: record.createdAt }
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/bookings?documentId=${encodeURIComponent(record.bookingId)}&key=${encodeURIComponent(apiKey)}`
  let res
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields }) })
  } catch {
    throw new FormServiceError('Network error.', 'network')
  }
  if (!res.ok) throw new FormServiceError(`Booking could not be saved (${res.status}).`, 'http')
}

/** Saves a booking record. Throws FormServiceError on failure. */
export async function submitBooking(record) {
  if (bookingBackend === 'firestore') return saveToFirestore(record)
  if (bookingBackend === 'endpoint') return submitForm(record, { formName: 'booking', endpoint })
  throw new FormServiceError('Booking backend not configured.', 'not-configured')
}
