import { MapPinOff } from 'lucide-react'
import { WhatsAppButton } from '../ui/Button.jsx'
import { scenarioById, collectionTypes } from '../../config/scenarios.js'
import { schedule, slotLabel } from '../../config/timeSlots.js'
import { formatRand } from '../../config/rates.js'
import { itemLines, dateLabel } from '../../lib/buildWhatsAppMessage.js'
import { quoteTotalLabel } from '../../lib/calculateQuote.js'

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 sm:grid-cols-[9rem_1fr]">
    <dt className="text-sm font-semibold text-muted">{label}</dt>
    <dd className="text-brand-black">{children}</dd>
  </div>
)

/** Step 6: the estimated quote, or the "outside our Quick Book area" fallback. */
export default function QuoteSummary({ booking, quote, area, now, whatsappMessage }) {
  if (!area.inside || quote.status === 'over') {
    return (
      <div className="rounded-2xl border-2 border-brand-yellow bg-white p-5" role="status">
        <p className="flex items-center gap-2 text-lg font-bold text-brand-black">
          <MapPinOff className="size-5" aria-hidden="true" /> This address is outside our Quick Book area.
        </p>
        <p className="mt-2 text-muted">We may still be able to help. Send us the details on WhatsApp and we’ll confirm availability.</p>
        <WhatsAppButton label="Ask on WhatsApp" message={whatsappMessage} className="mt-4 w-full sm:w-auto" />
      </div>
    )
  }

  const c = booking.collection
  const slot = schedule.slots.find((s) => s.id === booking.timeSlot)
  const total = quoteTotalLabel(quote)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-black p-5 text-white">
        <p className="text-sm font-semibold tracking-wider text-white/70 uppercase">Estimated Delivery Quote</p>
        <p className="mt-1 text-4xl font-extrabold tabular-nums">
          {total ? (
            <span>
              {quote.isFrom && <span className="mr-2 text-xl font-semibold text-white/80">From </span>}
              <span className="rounded-lg bg-brand-yellow px-2 text-brand-black">{formatRand(quote.total)}</span>
            </span>
          ) : (
            <span className="text-xl">Confirmed on WhatsApp</span>
          )}
        </p>
        {quote.lines?.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-white/85">
            {quote.lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-4"><span>{l.label}</span><span className="tabular-nums">{formatRand(l.amount)}</span></li>
            ))}
          </ul>
        )}
        {quote.pending?.length > 0 && (
          <p className="mt-3 text-sm text-white/75">Item charges for {quote.pending.join(', ')} are confirmed on WhatsApp.</p>
        )}
      </div>

      <dl className="divide-y divide-line rounded-2xl border border-line bg-white px-4">
        <Row label="Booking type">{scenarioById[booking.scenario]?.label}</Row>
        <Row label="Items">
          <ul>{itemLines(booking.items).map((l) => <li key={l}>{l}</li>)}</ul>
        </Row>
        <Row label="Collection">
          {c.type === 'store' && c.storeName ? <>{c.storeName}<br /></> : c.type !== 'store' ? <>{collectionTypes.find((t) => t.value === c.type)?.label}<br /></> : null}
          {c.address}
        </Row>
        <Row label="Delivery">{booking.delivery.address}</Row>
        <Row label="Distance">{quote.km} km{booking.distance.source === 'manual' ? ' (approx.)' : ''}</Row>
        <Row label="Date">{dateLabel(booking, now)}</Row>
        <Row label="Time slot">{slot ? slotLabel(slot) : '—'}</Row>
        <Row label="Estimated total">
          <strong>{total || 'Confirmed on WhatsApp'}</strong>
        </Row>
      </dl>

      <p className="text-sm text-muted">This is an estimated Quick Book quote and may be confirmed by Terrific Loads before collection.</p>
    </div>
  )
}
