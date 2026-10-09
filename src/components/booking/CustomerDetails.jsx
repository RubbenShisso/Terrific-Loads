import Field from '../forms/Field.jsx'

/** Step 5: who's booking. */
export default function CustomerDetails({ booking, dispatch, errors }) {
  const c = booking.customer
  const set = (field) => (e) => dispatch({ type: 'set', section: 'customer', field, value: e.target.value })
  return (
    <div className="space-y-5">
      <Field id="qb-name" name="name" label="Full name" autoComplete="name" value={c.name} onChange={set('name')} error={errors.name} />
      <Field id="qb-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" label="WhatsApp number" placeholder="081 234 5678" value={c.whatsapp} onChange={set('whatsapp')} error={errors.whatsapp} />
      <Field id="qb-phone" name="phone" type="tel" inputMode="tel" label="Phone number" optional hint="Only if it’s different from your WhatsApp number." value={c.phone} onChange={set('phone')} error={errors.phone} />
      <Field id="qb-email" name="email" type="email" inputMode="email" autoComplete="email" label="Email address" optional value={c.email} onChange={set('email')} error={errors.email} />
    </div>
  )
}
