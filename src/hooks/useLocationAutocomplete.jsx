import { useEffect, useId, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { searchLocations, LOCATION_ATTRIBUTION, GOOGLE_ATTRIBUTION } from '../lib/locationSearch.js'

/**
 * Accessible address autocomplete (ARIA combobox) for any text input.
 *
 *   const ac = useLocationAutocomplete({ value, onChange, onSelect })
 *   <input {...ac.inputProps} />   // plus your own props
 *   {ac.listbox}                   // place right after the input, inside a `relative` wrapper
 *
 * The box stays free text: suggestions are optional. Arrow keys move through
 * suggestions, Enter picks one, Escape closes the list.
 */
export default function useLocationAutocomplete({ value, onChange, onSelect, onBlur, onKeyDown, name }) {
  const listId = useId()
  const [options, setOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const typed = useRef(false) // only search after the user types, not after a pick
  const blurTimer = useRef(null)

  useEffect(() => {
    if (!typed.current) return
    const q = (value || '').trim()
    if (q.length < 3) {
      setOptions([])
      setOpen(false)
      setStatus('idle')
      return
    }
    const controller = new AbortController()
    const t = setTimeout(async () => {
      setStatus('loading')
      try {
        const found = await searchLocations(q, { signal: controller.signal })
        setOptions(found)
        setActive(-1)
        setOpen(true)
        setStatus('done')
      } catch (err) {
        if (err.name !== 'AbortError') {
          setOptions([])
          setOpen(false)
          setStatus('error') // offline or service down: the box keeps working as plain text
        }
      }
    }, 280)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [value])

  useEffect(() => () => clearTimeout(blurTimer.current), [])

  const pick = (opt) => {
    typed.current = false
    onChange?.({ target: { name, value: opt.label } })
    onSelect?.(opt)
    setOpen(false)
    setActive(-1)
  }

  const inputProps = {
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': open && options.length > 0,
    'aria-controls': listId,
    'aria-activedescendant': open && active >= 0 ? `${listId}-${active}` : undefined,
    autoComplete: 'off',
    value,
    onChange: (e) => {
      typed.current = true
      onChange?.(e)
    },
    onKeyDown: (e) => {
      if (open && options.length) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActive((i) => (i + 1) % options.length)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActive((i) => (i <= 0 ? options.length - 1 : i - 1))
          return
        }
        if (e.key === 'Enter' && active >= 0) {
          e.preventDefault()
          pick(options[active])
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation() // don't close a surrounding dialog
          setOpen(false)
          return
        }
      } else if (e.key === 'ArrowDown' && options.length) {
        e.preventDefault()
        setOpen(true)
        setActive(0)
        return
      }
      onKeyDown?.(e)
    },
    onBlur: (e) => {
      blurTimer.current = setTimeout(() => setOpen(false), 150)
      onBlur?.(e)
    },
  }

  const count = options.length
  const listbox = (
    <>
      <p className="sr-only" aria-live="polite">
        {status === 'done' && open ? (count ? `${count} address suggestion${count === 1 ? '' : 's'}. Use the arrow keys to choose.` : 'No address suggestions.') : ''}
      </p>
      {open && count > 0 && (
        <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-line bg-white shadow-lg shadow-brand-black/10">
          <ul id={listId} role="listbox" aria-label="Address suggestions" className="max-h-72 overflow-y-auto py-1">
            {options.map((opt, i) => (
              <li
                key={opt.id + i}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()} // keep focus in the input
                onClick={() => pick(opt)}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-11 cursor-pointer items-start gap-3 px-3 py-2 ${i === active ? 'bg-surface' : ''}`}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block font-medium text-brand-black">{opt.primary}</span>
                  {opt.secondary && <span className="block truncate text-sm text-muted">{opt.secondary}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-3 py-1.5 text-[11px] text-muted">{options[0].source === 'google' ? GOOGLE_ATTRIBUTION : LOCATION_ATTRIBUTION}</p>
        </div>
      )}
    </>
  )

  return { inputProps, listbox, status }
}
