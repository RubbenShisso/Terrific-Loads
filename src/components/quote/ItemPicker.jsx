import { Armchair, BedDouble, DoorClosed, Minus, PackagePlus, Plus, Refrigerator, Sofa, Trash2, Utensils } from 'lucide-react'
import Field from '../forms/Field.jsx'
import { items, itemById, MAX_QUANTITY } from '../../config/items.js'

// Decorative icons for the client's item list.
export const itemIcons = { couch: Sofa, table: Utensils, chairs: Armchair, fridge: Refrigerator, bed: BedDouble, wardrobe: DoorClosed, other: PackagePlus }

/** Step 1: what needs delivering? Several items, each with a quantity. */
export default function ItemPicker({ list, onAdd, onQty, onRemove, onDescribe, errors, idPrefix }) {
  const total = list.reduce((n, it) => n + it.qty, 0)
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-semibold text-brand-black">Tap an item to add it</legend>
        <p className="mt-1 text-sm text-muted">Add everything that needs moving. You can change the quantity below.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {items.map((opt) => {
            const Icon = itemIcons[opt.id]
            const count = list.filter((it) => it.id === opt.id).reduce((n, it) => n + it.qty, 0)
            const isOther = opt.needsDescription
            return (
              <button
                key={opt.id}
                type="button"
                className="chip !min-h-12 !justify-start !gap-2 !rounded-xl !px-3 text-left"
                aria-pressed={isOther ? undefined : count > 0}
                onClick={() => onAdd(opt.id)}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="flex-1">{isOther ? 'Other item' : opt.label}</span>
                {count > 0 && !isOther ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-black text-xs text-brand-yellow">{count}</span>
                ) : (
                  <Plus className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </fieldset>

      <section aria-labelledby={`${idPrefix}-items-title`}>
        <h4 id={`${idPrefix}-items-title`} className="font-semibold text-brand-black">
          Your items {total > 0 && <span className="text-muted">({total})</span>}
        </h4>
        {list.length === 0 ? (
          <p id={`${idPrefix}-items-error`} tabIndex={-1} className={`mt-2 text-sm ${errors.items ? 'font-medium text-danger' : 'text-muted'}`} data-error={errors.items ? '' : undefined}>
            {errors.items || 'No items yet. Tap an item above to add it.'}
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {list.map((it) => {
              const meta = itemById[it.id]
              const name = meta.needsDescription ? 'Other item' : meta.label
              return (
                <li key={it.uid} className="rounded-2xl border border-line bg-white p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-semibold text-brand-black">{name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Quantity of ${name}`}>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-full disabled:opacity-40"
                          onClick={() => onQty(it.uid, it.qty - 1)}
                          disabled={it.qty <= 1}
                          aria-label={`One fewer ${name.toLowerCase()}`}
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">{it.qty}</span>
                        <button
                          type="button"
                          className="grid size-11 place-items-center rounded-full disabled:opacity-40"
                          onClick={() => onQty(it.uid, it.qty + 1)}
                          disabled={it.qty >= MAX_QUANTITY}
                          aria-label={`One more ${name.toLowerCase()}`}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface hover:text-danger"
                        onClick={() => onRemove(it.uid)}
                        aria-label={`Remove ${name.toLowerCase()}`}
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {meta.needsDescription && (
                    <div className="mt-3">
                      <Field
                        id={`${idPrefix}-desc-${it.uid}`}
                        label="What is it?"
                        placeholder="e.g. bookshelf, washing machine, chest freezer"
                        value={it.description}
                        onChange={(e) => onDescribe(it.uid, e.target.value)}
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
