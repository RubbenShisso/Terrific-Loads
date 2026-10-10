/**
 * Items customers can choose in the quote form (client's list).
 * "Other" asks for a description and can be added more than once.
 * `popular` items appear in the homepage "Popular items" section.
 */
export const items = [
  { id: 'couch', label: 'Couch / Sofa', short: 'Couch', popular: true },
  { id: 'table', label: 'Table', short: 'Table', popular: true },
  { id: 'chairs', label: 'Chairs', short: 'Chairs', popular: true },
  { id: 'fridge', label: 'Fridge', short: 'Fridge', popular: true },
  { id: 'bed', label: 'Bed / Mattress', short: 'Bed or mattress', popular: true },
  { id: 'wardrobe', label: 'Wardrobe', short: 'Wardrobe', popular: true },
  { id: 'other', label: 'Other', short: 'Other item', needsDescription: true },
]

export const itemById = Object.fromEntries(items.map((i) => [i.id, i]))
export const MAX_QUANTITY = 20
