// White field, light border, black text. Focus: black border with a yellow ring.
const inputCls =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-muted/80 transition focus:outline-none focus:shadow-none focus:ring-[3px]'

export default function Field({ id, label, hint, error, optional, as = 'input', children, ...props }) {
  const Tag = as
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const state = error
    ? 'border-danger focus:border-danger focus:ring-brand-yellow'
    : 'border-line focus:border-brand-black focus:ring-brand-yellow'

  return (
    <div>
      <label htmlFor={id} className="block font-medium text-brand-black">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
      <Tag
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`${inputCls} ${state} ${as === 'textarea' ? 'min-h-28 resize-y' : ''}`}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
