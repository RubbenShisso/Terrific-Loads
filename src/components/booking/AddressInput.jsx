import { useEffect, useRef } from 'react'
import Field from '../forms/Field.jsx'
import { loadPlaces, mapsEnabled } from '../../lib/calculateDistance.js'

/**
 * Address field. With VITE_GOOGLE_MAPS_API_KEY set it adds Google Places
 * Autocomplete (South Africa only); without it, it's a normal text field.
 * onPlace receives the matched place's full description for the area check.
 */
export default function AddressInput({ onChange, onPlace, ...props }) {
  const wrap = useRef(null)
  const latest = useRef({ onChange, onPlace })
  latest.current = { onChange, onPlace }

  useEffect(() => {
    if (!mapsEnabled) return
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
      <Field autoComplete={mapsEnabled ? 'off' : 'street-address'} onChange={onChange} {...props} />
    </div>
  )
}
