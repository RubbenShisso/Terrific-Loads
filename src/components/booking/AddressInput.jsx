import { useEffect, useRef } from 'react'
import Field from '../forms/Field.jsx'
import { loadPlaces, mapsEnabled } from '../../lib/calculateDistance.js'
import useLocationAutocomplete from '../../hooks/useLocationAutocomplete.jsx'

/**
 * Address field with real place suggestions.
 *  - With VITE_GOOGLE_MAPS_API_KEY: Google Places Autocomplete (South Africa only).
 *  - Without it: free OpenStreetMap suggestions (src/lib/locationSearch.js).
 * Either way the field stays free text. onPlace receives the picked place's full
 * description, which the Quick Book service-area check uses.
 */
export default function AddressInput(props) {
  return mapsEnabled ? <GoogleAddressInput {...props} /> : <OsmAddressInput {...props} />
}

function OsmAddressInput({ onChange, onPlace, value, name, ...props }) {
  const ac = useLocationAutocomplete({ name, value, onChange, onSelect: (opt) => onPlace?.(opt.place) })
  return <Field name={name} {...props} {...ac.inputProps} after={ac.listbox} />
}

function GoogleAddressInput({ onChange, onPlace, ...props }) {
  const wrap = useRef(null)
  const latest = useRef({ onChange, onPlace })
  latest.current = { onChange, onPlace }

  useEffect(() => {
    let ac
    let listener
    let cancelled = false
    loadPlaces().then((google) => {
      const input = wrap.current?.querySelector('input')
      if (cancelled || !google?.maps?.places || !input) return
      ac = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'za' },
        fields: ['formatted_address', 'name', 'address_components'],
      })
      listener = ac.addListener('place_changed', () => {
        const place = ac.getPlace()
        if (!place?.formatted_address) return
        const text = place.name && !place.formatted_address.startsWith(place.name)
          ? `${place.name}, ${place.formatted_address}`
          : place.formatted_address
        latest.current.onChange?.({ target: { name: props.name, value: text } })
        const areaText = (place.address_components || []).map((c) => c.long_name).join(', ')
        latest.current.onPlace?.(areaText || place.formatted_address)
      })
    })
    return () => {
      cancelled = true
      listener?.remove?.()
    }
  }, [props.name])

  return (
    <div ref={wrap}>
      <Field autoComplete="off" onChange={onChange} {...props} />
    </div>
  )
}
