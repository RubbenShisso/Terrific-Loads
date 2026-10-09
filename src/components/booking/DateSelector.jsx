import { CalendarClock } from 'lucide-react'
import TimeSlotSelector from './TimeSlotSelector.jsx'
import { WhatsAppButton } from '../ui/Button.jsx'
import { getAvailableSlots, getQuickBookDays } from '../../lib/availability.js'
import { schedule } from '../../config/timeSlots.js'

/** Step 4: today or tomorrow, then a time slot. Later dates go to WhatsApp. */
export default function DateSelector({ booking, dispatch, errors, now, whatsappMessage }) {
  const days = getQuickBookDays(now)
  const todaySlots = getAvailableSlots('today', now)
  const slots = getAvailableSlots(booking.date, now)

  const options = [
    { value: 'today', title: 'Today', sub: todaySlots.length ? days.today.label : 'No slots left today', disabled: todaySlots.length === 0 },
    { value: 'tomorrow', title: 'Tomorrow', sub: days.tomorrow.label },
    { value: 'later', title: 'Later date', sub: '2 days or more ahead' },
  ]

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-semibold text-brand-black">Delivery date</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {options.map((o) => (
            <label key={o.value} className={`chip !h-auto !flex-col !items-start !gap-0 !rounded-xl !px-4 !py-3 ${o.disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
              <input
                type="radio"
                name="booking-date"
                className="sr-only"
                value={o.value}
                checked={booking.date === o.value}
                disabled={o.disabled}
                onChange={() => dispatch({ type: 'setDate', date: o.value })}
              />
              <span className="text-base">{o.title}</span>
              <span className="text-xs font-medium text-muted">{o.sub}</span>
            </label>
          ))}
        </div>
        {errors.date && <p className="mt-2 text-sm font-medium text-danger">{errors.date}</p>}
        <p className="mt-2 text-sm text-muted">We operate until {schedule.closingTime}. Same-day and next-day bookings are subject to availability.</p>
      </fieldset>

      {(booking.date === 'today' || booking.date === 'tomorrow') && (
        <TimeSlotSelector slots={slots} value={booking.timeSlot} onChange={(id) => dispatch({ type: 'setSlot', slot: id })} error={errors.timeSlot} />
      )}

      {booking.date === 'later' && (
        <div className="rounded-2xl border-2 border-brand-yellow bg-white p-5" role="status">
          <p className="flex items-center gap-2 text-lg font-bold text-brand-black">
            <CalendarClock className="size-5" aria-hidden="true" /> Planning ahead?
          </p>
          <p className="mt-2 text-muted">
            Quick Book is available for today and tomorrow. For future bookings, chat to us on WhatsApp and we’ll arrange it with you.
          </p>
          <WhatsAppButton label="Book Future Delivery on WhatsApp" message={whatsappMessage} className="mt-4 w-full sm:w-auto" />
        </div>
      )}
    </div>
  )
}
