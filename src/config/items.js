/**
 * Quick Book item catalogue. Item ids are the keys used by src/config/pricing.js.
 * `popular` items appear in the homepage "Popular items" section.
 */
export const itemCategories = [
  { id: 'furniture', label: 'Furniture' },
  { id: 'large', label: 'Large items' },
]

export const items = [
  { id: 'couch', category: 'furniture', label: 'Couch / Sofa', short: 'Couch', popular: true },
  { id: 'dining-table', category: 'furniture', label: 'Dining Table', short: 'Dining table', popular: true },
  { id: 'coffee-table', category: 'furniture', label: 'Coffee Table', short: 'Coffee table', popular: true },
  { id: 'chairs', category: 'furniture', label: 'Chairs', short: 'Chairs' },
  { id: 'bed-frame', category: 'furniture', label: 'Bed Frame', short: 'Bed frame' },
  { id: 'mattress', category: 'furniture', label: 'Mattress', short: 'Mattress' },
  { id: 'desk', category: 'furniture', label: 'Desk', short: 'Desk' },
  { id: 'cabinet', category: 'furniture', label: 'Cabinet', short: 'Cabinet' },
  { id: 'tv-stand', category: 'furniture', label: 'TV Stand', short: 'TV stand' },
  { id: 'chest-of-drawers', category: 'furniture', label: 'Chest of Drawers', short: 'Chest of drawers' },
  { id: 'other-furniture', category: 'furniture', label: 'Other Furniture', short: 'Other furniture', needsDescription: true },
  { id: 'fridge', category: 'large', label: 'Fridge', short: 'Fridge', popular: true },
  { id: 'washing-machine', category: 'large', label: 'Washing Machine', short: 'Washing machine', popular: true },
  { id: 'tumble-dryer', category: 'large', label: 'Tumble Dryer', short: 'Tumble dryer' },
  { id: 'dishwasher', category: 'large', label: 'Dishwasher', short: 'Dishwasher' },
  { id: 'large-tv', category: 'large', label: 'Large TV', short: 'Large TV' },
  { id: 'large-appliance', category: 'large', label: 'Large Appliance', short: 'Large appliance' },
  { id: 'other-large', category: 'large', label: 'Other Large Item', short: 'Other large item', needsDescription: true },
]

export const itemById = Object.fromEntries(items.map((i) => [i.id, i]))
export const MAX_QUANTITY = 20
