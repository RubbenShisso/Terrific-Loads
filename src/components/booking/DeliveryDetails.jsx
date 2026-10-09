import { LoaderCircle, Route } from 'lucide-react'
import Field from '../forms/Field.jsx'
import AddressInput from './AddressInput.jsx'
import { propertyTypes } from '../../config/scenarios.js'
import { mapsEnabled } from '../../lib/calculateDistance.js'

/** Step 3: where is it going, plus the road distance (Google) or a rough km (manual). */
export default function DeliveryDetails({ booking, dispatch, errors, distanceState }) {
  const d = booking.delivery
  const set = (field) => (e) => dispatch({ type: 'set', section: 'delivery', field, value: e.target.value })
  const auto = mapsEnabled && distanceState.status !== 'error'

  return (
    <div className="space-y-5">
      <AddressInput
        id="qb-delivery-address"
        name="deliveryAddress"
        label="Delivery address"
        value={d.address}
        onChange={set('address')}
        onPlace={(place) => dispatch({ type: 'set', section: 'delivery', field: 'place', value: place })}
        error={errors.address}
      />

      <div className="rounded-2xl border border-line bg-surface p-4">
        <p className="flex items-center gap-2 font-semibold text-brand-black">
          <Route className="size-5" aria-hidden="true" /> Distance
        </p>
        {auto ? (
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {distanceState.status === 'loading' && (
              <span className="inline-flex items-center gap-2"><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Working out the road distance…</span>
            )}
            {distanceState.status === 'done' && (
              <>Road distance: <strong className="text-brand-black">{booking.distance.km} km</strong>{booking.distance.durationMin ? ` (about ${booking.distance.durationMin} min)` : ''}</>
            )}
            {distanceState.status === 'idle' && 'We’ll work this out from the two addresses.'}
          </p>
        ) : (
          <div className="mt-2">
            <Field
              id="qb-distance"
              name="distanceKm"
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              label="Roughly how far is it? (km)"
              hint="From collection to delivery. A rough guess is fine; we’ll confirm it."
              placeholder="e.g. 14"
              value={booking.distance.km}
              onChange={(e) => dispatch({ type: 'setDistance', km: e.target.value, source: 'manual' })}
              error={errors.distance}
            />
          </div>
        )}
      </div>

      <Field as="select" id="qb-property" name="propertyType" label="Property type" optional value={d.propertyType} onChange={set('propertyType')}>
        <option value="">Choose…</option>
        {propertyTypes.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="qb-delivery-contact" name="deliveryContact" label="Delivery contact name" optional hint="If it’s not you." value={d.contactName} onChange={set('contactName')} />
        <Field id="qb-delivery-number" name="deliveryNumber" type="tel" inputMode="tel" label="Delivery contact number" optional value={d.contactNumber} onChange={set('contactNumber')} error={errors.contactNumber} />
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-2 font-medium text-brand-black">
        <input
          type="checkbox"
          className="size-5 accent-brand-black"
          checked={Boolean(d.stairs)}
          onChange={(e) => dispatch({ type: 'set', section: 'delivery', field: 'stairs', value: e.target.checked })}
        />
        There are stairs and no lift
      </label>
      <Field id="qb-access" name="access" label="Access, stairs or lift notes" optional placeholder="e.g. 2nd floor, narrow staircase, gate code" value={d.access} onChange={set('access')} />
      <Field id="qb-delivery-notes" as="textarea" rows={2} name="deliveryNotes" label="Delivery notes" optional value={d.notes} onChange={set('notes')} />
    </div>
  )
}
