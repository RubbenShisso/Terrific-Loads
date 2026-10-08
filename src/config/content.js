import {
  Armchair,
  BedDouble,
  Boxes,
  Briefcase,
  Clock,
  DoorClosed,
  House,
  Microwave,
  PackageOpen,
  Refrigerator,
  ShoppingBag,
  Sofa,
  Store,
  Utensils,
  WashingMachine,
} from 'lucide-react'

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/**
 * Services. The four `primary` ones are the main offer (homepage cards).
 * The others are kept on the Services page as extra ways the team helps.
 * Collections are always subject to size, weight, vehicle space, access and availability.
 */
export const services = [
  {
    id: 'furniture',
    primary: true,
    icon: Sofa,
    title: 'Furniture delivery',
    short: 'Couches, beds, dining tables, chairs, cabinets, desks and other furniture bought from retail stores.',
    body: 'Bought a couch, bed, dining table, cabinet or desk that won’t fit in your car? We collect it from the store, showroom or warehouse and deliver it to your door, wrapped and secured for the trip.',
    photo: 'carrying-bench',
  },
  {
    id: 'appliances',
    primary: true,
    icon: Refrigerator,
    title: 'Appliance delivery',
    short: 'Fridges, freezers, washing machines, dishwashers, tumble dryers and other large household appliances.',
    body: 'New fridge, freezer, washing machine, dishwasher or tumble dryer? We collect large household appliances from the store and bring them home for you. Send us the model or size so we can confirm it fits on the truck.',
    photo: 'team-truck-doors',
  },
  {
    id: 'bulky-items',
    primary: true,
    icon: PackageOpen,
    title: 'Bulky item collection',
    short: 'Suitable oversized retail purchases that won’t easily fit inside a standard car.',
    body: 'If it’s too big or too awkward for your car, ask us. We collect suitable oversized retail purchases, depending on the item’s size and weight, access at both addresses and space on the truck.',
    photo: 'truck-loaded',
  },
  {
    id: 'same-day',
    primary: true,
    icon: Clock,
    title: 'Same-day store collection',
    short: 'Bought something today but the store can’t deliver it? Check if we can collect it.',
    body: 'Bought something today but the store can’t deliver it today? Contact us to check whether same-day collection and delivery can be arranged. Next-day collection is also available, subject to availability.',
    photo: 'store-collection',
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    title: 'Marketplace & private seller collections',
    short: 'Bought something second-hand? We’ll fetch it from the seller.',
    body: 'Found the perfect piece on Marketplace or from a private seller? Tell us where it is and where it’s going, and we’ll collect it and bring it home.',
    photo: 'delivery-home',
  },
  {
    id: 'business',
    icon: Briefcase,
    title: 'Small business & reseller deliveries',
    short: 'Deliveries for resellers, stores and interior businesses.',
    body: 'Resellers, stores and interior or design businesses use us to get furniture and other bulky items to their customers. Message us about once-off or regular deliveries.',
    photo: 'truck-chairs',
  },
]

export const benefits = [
  { icon: Clock, title: 'Same-day & next-day', text: 'Collection options, subject to availability.' },
  { icon: Store, title: 'We collect from the store', text: 'Retail stores, showrooms and warehouses.' },
  { icon: House, title: 'Straight to your door', text: 'Wrapped, secured and delivered with care.' },
]

export const steps = [
  { title: 'Buy your item', text: 'Purchase furniture, an appliance or another bulky item from your preferred retailer.' },
  { title: 'Contact Terrific Loads', text: 'Send the collection location, delivery address, item details and preferred delivery time.' },
  { title: 'Confirm your quote', text: 'Receive a delivery quote and confirm availability.' },
  { title: 'We collect & deliver', text: 'Our team collects your item and transports it to your requested destination.' },
]

/** "If it won't fit in your car" categories. Decorative icons, real item types. */
export const deliverables = [
  { icon: Sofa, label: 'Sofas & couches' },
  { icon: BedDouble, label: 'Beds & mattresses' },
  { icon: Utensils, label: 'Dining tables' },
  { icon: Refrigerator, label: 'Fridges & freezers' },
  { icon: WashingMachine, label: 'Washing machines' },
  { icon: Microwave, label: 'Dishwashers' },
  { icon: DoorClosed, label: 'Cabinets & wardrobes' },
  { icon: Boxes, label: 'Other bulky retail purchases' },
]

/**
 * Stores the client's own promotional material shows they have collected from.
 * Shown as plain text only (no logos) and never as partners or endorsements.
 * Logos may only be added once each retailer's permission is confirmed.
 */
export const storesCollectedFrom = [
  'Hertex',
  'Coricraft',
  'Decofurn Furniture',
  'Weylandts',
  'Sofaworx',
  'Bargain Buys',
  'Ouhout',
  'Tafelberg Furnishers',
  'Die Handelshuis',
]

/** Year-round promo banner: no sale dates or discounts. */
export const promo = {
  title: 'Found the deal. Need the delivery?',
  text: 'Don’t miss out on a great in-store purchase because it won’t fit in your car or the retailer can’t deliver when you need it. Contact Terrific Loads for convenient collection and delivery options.',
  cta: 'Get It Delivered',
}

/** Hero clip: the client's real "Loading" video, played only on tap. */
export const heroVideo = {
  src: '/videos/loading.mp4',
  label: 'The Terrific Loads team loading wrapped furniture',
}

// Weekend and helper policies are still to be confirmed by the client,
// so they are intentionally left out until then.
export const faqs = [
  {
    id: 'how-quickly',
    q: 'How quickly can you deliver?',
    a: 'We offer same-day and next-day collection and delivery, subject to availability and what needs to be moved. Message us early in the day for the best chance of a same-day slot.',
  },
  { id: 'where', q: 'Where do you deliver?', a: 'Cape Town and surrounding areas.' },
  {
    id: 'what',
    q: 'What can you deliver?',
    a: 'Furniture, large household appliances like fridges, freezers, washing machines and dishwashers, and other bulky retail purchases that won’t fit in a car. Whether we can take an item depends on its size and weight, access at both addresses and space on the truck, so send us the details first.',
  },
  {
    id: 'store-collection',
    q: 'Can you collect directly from the store?',
    a: 'Yes, where the store allows a customer-authorised collection. Let the store know we’re coming and send us your order number or proof of purchase.',
  },
  {
    id: 'get-a-quote',
    q: 'How do I get a quote?',
    a: 'WhatsApp us the collection store or address, the delivery address and what needs to be delivered, or fill in the quote form. We’ll reply with a price.',
  },
  {
    id: 'cost',
    q: 'How much does delivery cost?',
    a: 'Our rates depend on distance. Use the quote calculator for an estimate, then send it to us on WhatsApp and we’ll confirm your final quote.',
  },
]

export const gallery = [
  { photo: 'loading-truck', caption: 'Loading up' },
  { photo: 'carrying-bench', caption: 'Carried in with care' },
  { photo: 'delivered-table', caption: 'Delivered and in place' },
  { photo: 'store-collection', caption: 'Collected from the showroom' },
  { photo: 'carrying-home', caption: 'To the front door' },
  { photo: 'table-loaded', caption: 'Wrapped and secured' },
  { photo: 'rugs-delivered', caption: 'Rugs delivered' },
  { photo: 'truck-chairs', caption: 'Ready to roll' },
]
