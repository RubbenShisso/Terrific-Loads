import { slotLabel } from '../../config/timeSlots.js'

/** Time-slot chips. Only slots still available are passed in. */
export default function TimeSlotSelector({ slots, value, onChange, error }) {
  return (
    <fieldset>
      <legend className="font-semibold text-brand-black">Time slot</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((s) => (
          <label key={s.id} className="chip !rounded-xl">
            <input type="radio" name="time-slot" className="sr-only" value={s.id} checked={value === s.id} onChange={() => onChange(s.id)} />
            {slotLabel(s)}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
    </fieldset>
  )
}
