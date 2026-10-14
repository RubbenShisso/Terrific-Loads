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
    title: 'Same-day & next-day delivery',
    short: 'Bought something today but the store can’t deliver soon? We can collect it today or tomorrow.',
    body: 'Bought something today but the store can’t deliver it when you need it? We offer same-day delivery, where we collect from the store and deliver the same day, and next-day delivery for tomorrow. Contact us to check availability for your item.',
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

/** The client's process: items -> addresses -> prices and option -> WhatsApp -> deposit -> delivery. */
export const steps = [
  { title: 'Tell us what and where', text: 'Choose your items, then add the collection address, the delivery address and any extra stops.' },
  { title: 'See your price', text: 'Get indicative Standard and Express prices for a straightforward delivery, then choose your delivery option.' },
  { title: 'Confirm on WhatsApp', text: 'We check the details and confirm the price and availability. A 50% deposit then secures your booking.' },
  { title: 'We collect & deliver', text: 'The rest is paid before delivery, and we bring your item from the store to your door.' },
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
 * Logos are white wordmarks (public/images/stores), shown on a dark banner.
 * Never presented as partners or endorsements; the section carries a disclaimer.
 */
export const storesCollectedFrom = [
  { name: 'Hertex', logo: 'hertex' },
  { name: 'Coricraft', logo: 'coricraft' },
  { name: 'Decofurn Furniture', logo: 'decofurn' },
  { name: 'Weylandts', logo: 'weylandts' },
  { name: 'Sofaworx', logo: 'sofaworx' },
  { name: 'Ouhout', logo: 'ouhout' },
  { name: 'Tafelberg Furnishers', logo: 'tafelberg' },
  { name: 'Die Handelshuis', logo: 'handelshuis' },
  { name: 'Makro', logo: 'makro' },
  { name: 'Game', logo: 'game' },
]

/** Year-round promo banner: no sale dates or discounts. */
export const promo = {
  title: 'Found the deal. Need the delivery?',
  text: 'Don’t miss out on a great in-store purchase because it won’t fit in your car or the retailer can’t deliver when you need it. Contact Terrific Loads for convenient collection and delivery options.',
  cta: 'Get It Delivered',
}

/** Hero clips: the client's real team videos, played only on tap, cycled with prev/next. */
export const heroVideos = [
  { src: '/videos/loading.mp4', label: 'The Terrific Loads team loading wrapped furniture' },
  { src: '/videos/team-clip-1.mp4', label: 'The Terrific Loads team on a delivery' },
  { src: '/videos/team-clip-2.mp4', label: 'The Terrific Loads team on a delivery' },
  { src: '/videos/team-clip-3.mp4', label: 'The Terrific Loads team on a delivery' },
]

/** About page promo: 45s informative video with voice-over. Portrait cut on phones, landscape elsewhere. */
export const aboutVideo = {
  landscape: '/videos/terrific-loads-promo-45s.mp4',
  portrait: '/videos/terrific-loads-promo-45s-vertical.mp4',
  landscapePoster: '/videos/terrific-loads-promo-45s-poster.jpg',
  portraitPoster: '/videos/terrific-loads-promo-45s-vertical-poster.jpg',
  label: 'Terrific Loads: how our collection and delivery service works',
  description:
    'How Terrific Loads collects furniture, appliances and other bulky purchases from the store and delivers them to your door in Cape Town, with indicative prices by distance.',
  duration: 'PT45S',
  uploadDate: '2026-10-13',
}

// Weekend and helper policies are still to be confirmed by the client,
// so they are intentionally left out until then.
export const faqs = [
  {
    id: 'how-quickly',
    q: 'How quickly can you deliver?',
    a: 'Standard Delivery can be the same day, with the delivery time agreed on WhatsApp. Express Delivery targets delivery within 3 hours, subject to availability. You can also schedule a delivery for the next day or a later date.',
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
    a: 'Use the quote form: choose your items, add the collection and delivery addresses and any extra stops, pick a delivery option and send it to us on WhatsApp. We confirm the price and availability there.',
  },
  {
    id: 'cost',
    q: 'How much does delivery cost?',
    a: 'Standard Delivery is priced by driving distance. Enter your items and addresses in the quote form to see the indicative price. Express Delivery costs R150 more than Standard. These prices are for one straightforward item. Multiple items, extra stops, difficult access, unusually heavy items or special handling are quoted on WhatsApp, and so are routes over 60 km.',
  },
  {
    id: 'budget',
    q: 'I need it today but I’m on a tight budget. Can you help?',
    a: 'Depending on the item and delivery requirements, we may be able to offer you a lower price. Message us on WhatsApp, and we’ll see what we can arrange. A lower price isn’t guaranteed.',
  },
  {
    id: 'payment',
    q: 'How do I pay?',
    a: 'We never ask for payment before we’ve checked your details, confirmed availability and agreed to the job on WhatsApp. A 50% deposit then secures your booking, and the remaining 50% is paid before delivery. Your booking is confirmed once we’ve acknowledged the job and received the deposit.',
  },
  {
    id: 'sell',
    q: 'Do you sell furniture?',
    a: 'No. Terrific Loads is a collection and delivery service for furniture and other large items. You buy the item, and we collect it and deliver it for you.',
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
  { photo: 'truck-coast', caption: 'On the road' },
]
