import Field from '../forms/Field.jsx'
import useLocationAutocomplete from '../../hooks/useLocationAutocomplete.jsx'

/**
 * Address box with real place suggestions (src/lib/locationSearch.js).
 * The box stays free text. The address is "committed" when a suggestion is
 * picked or the customer leaves the box, which starts the distance lookup;
 * it is never looked up mid-typing.
 *
 *   value / onText        the text in the box
 *   commit / onCommit     { text, point? } of the last committed address, or null
 */
export default function AddressField({ id, label, hint, placeholder, value, onText, commit, onCommit, error, inputRef }) {
  const ac = useLocationAutocomplete({
    name: id,
    value,
    onChange: (e) => onText(e.target.value),
    onSelect: (opt) => onCommit({ text: opt.label, point: Number.isFinite(opt.lat) ? { lat: opt.lat, lon: opt.lon } : undefined }),
    onBlur: (e) => {
      const text = e.target.value.trim()
      if (text === (commit?.text ?? '')) return
      onCommit(text ? { text } : null)
    },
  })
  return <Field id={id} label={label} hint={hint} placeholder={placeholder} error={error} ref={inputRef} {...ac.inputProps} after={ac.listbox} />
}
