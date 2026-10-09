import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Field from '../forms/Field.jsx'
import { items, itemCategories, itemById, MAX_QUANTITY } from '../../config/items.js'

/** Step 1: what are we collecting? Multiple items, each with a quantity. */
export default function ItemSelector({ booking, dispatch, errors }) {
  const firstCategory = itemById[booking.items[0]?.id]?.category || 'furniture'
  const [category, setCategory] = useState(firstCategory)
  const options = items.filter((i) => i.category === category)

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-semibold text-brand-black">Type of item</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {itemCategories.map((c) => (
            <label key={c.id} className="chip">
              <input type="radio" name="item-category" className="sr-only" checked={category === c.id} onChange={() => setCategory(c.id)} />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-brand-black">Tap to add an item</legend>
        <p className="mt-1 text-sm text-muted">Add as many as you need. Tap again to add another of the same.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((opt) => {
            const count = booking.items.filter((it) => it.id === opt.id).reduce((n, it) => n + it.qty, 0)
            return (
              <button
                key={opt.id}
                type="button"
                className="chip !justify-between !rounded-xl !px-3 text-left"
                aria-pressed={count > 0}
                onClick={() => dispatch({ type: 'addItem', id: opt.id })}
              >
                <span>{opt.label}</span>
                {count > 0 ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-black text-xs text-brand-yellow">{count}</span>
                ) : (
                  <Plus className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </fieldset>

      <section aria-labelledby="qb-selected-title">
        <h4 id="qb-selected-title" className="font-semibold text-brand-black">
          Your items {booking.items.length > 0 && <span className="text-muted">({booking.items.reduce((n, i) => n + i.qty, 0)})</span>}
        </h4>
        {booking.items.length === 0 ? (
          <p className={`mt-2 text-sm ${errors.items ? 'font-medium text-danger' : 'text-muted'}`} id="qb-items-error">
            {errors.items || 'No items yet. Tap an item above to add it.'}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {booking.items.map((it) => {
              const meta = itemById[it.id]
              return (
                <li key={it.uid} className="rounded-2xl border border-line bg-white p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-semibold text-brand-black">{meta.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Quantity of ${meta.label}`}>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-full disabled:opacity-40"
                          onClick={() => dispatch({ type: 'setQty', uid: it.uid, qty: it.qty - 1 })}
                          disabled={it.qty <= 1}
                          aria-label={`One fewer ${meta.short}`}
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">{it.qty}</span>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-full disabled:opacity-40"
                          onClick={() => dispatch({ type: 'setQty', uid: it.uid, qty: it.qty + 1 })}
                          disabled={it.qty >= MAX_QUANTITY}
                          aria-label={`One more ${meta.short}`}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface hover:text-danger"
                        onClick={() => dispatch({ type: 'removeItem', uid: it.uid })}
                        aria-label={`Remove ${meta.label}`}
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {meta.needsDescription && (
                    <div className="mt-3">
                      <Field
                        id={`qb-desc-${it.uid}`}
                        name={`desc-${it.uid}`}
                        label="What is it?"
                        placeholder="e.g. bookshelf, chest freezer"
                        value={it.description}
                        onChange={(e) => dispatch({ type: 'setDescription', uid: it.uid, description: e.target.value })}
                        error={errors[`desc-${it.uid}`]}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
