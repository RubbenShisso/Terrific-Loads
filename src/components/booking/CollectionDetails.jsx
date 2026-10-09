import Field from '../forms/Field.jsx'
import AddressInput from './AddressInput.jsx'
import { collectionTypes } from '../../config/scenarios.js'

/** Step 2: where are we collecting from? */
export default function CollectionDetails({ booking, dispatch, errors }) {
  const c = booking.collection
  const set = (field) => (e) => dispatch({ type: 'set', section: 'collection', field, value: e.target.value })

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="font-semibold text-brand-black">Collecting from</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {collectionTypes.map((t) => (
            <label key={t.value} className="chip">
              <input type="radio" name="collection-type" className="sr-only" value={t.value} checked={c.type === t.value} onChange={set('type')} />
              {t.label}
            </label>
          ))}
        </div>
        {errors.type && <p className="mt-2 text-sm font-medium text-danger">{errors.type}</p>}
      </fieldset>

      {c.type === 'store' && (
        <Field id="qb-store" name="storeName" label="Store name" placeholder="e.g. Makro, Coricraft" value={c.storeName} onChange={set('storeName')} error={errors.storeName} />
      )}
      <AddressInput
        id="qb-collection-address"
        name="collectionAddress"
        label="Collection address"
        hint={c.type === 'store' ? 'Store branch or address.' : 'Street address, or suburb for now.'}
        value={c.address}
        onChange={set('address')}
        onPlace={(place) => dispatch({ type: 'set', section: 'collection', field: 'place', value: place })}
        error={errors.address}
      />
      <Field id="qb-collection-contact" name="collectionContact" label="Collection contact name" optional value={c.contactName} onChange={set('contactName')} />
      <Field
        id="qb-collection-notes"
        as="textarea"
        rows={2}
        name="collectionNotes"
        label="Collection notes"
        optional
        placeholder="e.g. order number, collection bay, seller’s instructions"
        value={c.notes}
        onChange={set('notes')}
      />
    </div>
  )
}
