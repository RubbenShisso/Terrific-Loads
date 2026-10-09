import { Store, ShoppingBag, House, Car } from 'lucide-react'

/**
 * Quick Book scenarios. Each pre-fills the booking flow (collection type) and
 * is named in the WhatsApp message and the booking record.
 */
export const scenarios = [
  {
    id: 'store',
    label: 'Store Purchase',
    text: 'The store can’t deliver it today.',
    icon: Store,
    collectionType: 'store',
  },
  {
    id: 'marketplace',
    label: 'Facebook Marketplace',
    text: 'Bought from a private seller and needs collecting.',
    icon: ShoppingBag,
    collectionType: 'private-seller',
  },
  {
    id: 'property',
    label: 'Property to Property',
    text: 'Move furniture or a large item between properties.',
    icon: House,
    collectionType: 'residential',
  },
  {
    id: 'too-big',
    label: 'Too Big for My Car',
    text: 'It won’t fit in your vehicle.',
    icon: Car,
    collectionType: 'store',
  },
]

export const scenarioById = Object.fromEntries(scenarios.map((s) => [s.id, s]))

export const collectionTypes = [
  { value: 'store', label: 'Store' },
  { value: 'private-seller', label: 'Private Seller' },
  { value: 'residential', label: 'Residential Property' },
  { value: 'other', label: 'Other' },
]

export const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment / flat' },
  { value: 'townhouse', label: 'Townhouse / complex' },
  { value: 'business', label: 'Office / business' },
  { value: 'other', label: 'Other' },
]
