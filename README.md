# Terrific Loads website

Same-day and next-day furniture delivery in Cape Town. React + Vite + Tailwind CSS v4, Motion for animation, Lucide icons.

## Run and build

```
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the built site
npm run images     # regenerate images, logo, favicons, share image and hero video from client-assets/
```

`npm run build` builds the site, then prerenders every page to static HTML (`dist/index.html`, `dist/about.html`, ... `dist/404.html`) with `scripts/prerender.mjs`. Pages load with their content already in place and the browser hydrates them. Hosts should serve `/about` from `about.html` (Vercel `cleanUrls` and Netlify pretty URLs both do), and unknown paths get `404.html`.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_FORM_ENDPOINT` | URL that receives quote-form submissions as JSON (for example a Formspree form). If empty, the form offers "Send on WhatsApp instead" with the details pre-filled. |
| `VITE_GOOGLE_MAPS_API_KEY` | Optional. Enables Quick Book address autocomplete (Maps JavaScript API, Places) and road distance (Routes API). Without it, customers enter a rough distance. Restrict the key to the site's domain. |
| `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_API_KEY` | Optional. "Book This Delivery" saves bookings to the Firestore `bookings` collection (REST API, no SDK). Security rules must allow only `create` on `bookings`. |
| `VITE_BOOKING_ENDPOINT` | Optional. Any JSON endpoint for bookings instead of Firestore; falls back to `VITE_FORM_ENDPOINT`. With no booking backend, "Book This Delivery" sends the booking on WhatsApp. |

Copy `.env.example` to `.env` to set it locally.

## Quick Book

One reusable booking flow (`src/components/booking/`), opened from the homepage Quick Book cards, Popular items and the three scenario spotlights through `BookingProvider`. Steps: items, collection, delivery (and distance), date and time slot, customer details, estimated quote. Progress is kept for the browser tab, and "Continue on WhatsApp" is available on every step with everything entered so far.

| What | File |
|---|---|
| Items and popular items | `src/config/items.js` |
| Scenarios, collection and property types | `src/config/scenarios.js` |
| Pricing engine values (all CLIENT TO CONFIRM) | `src/config/pricing.js` |
| Quick Book area rules | `src/config/serviceAreas.js` |
| Time slots, closing time, same-day cut-off | `src/config/timeSlots.js` |
| Quote maths, distance, area check, WhatsApp message, availability | `src/lib/` |
| Booking records and storage | `src/services/bookingService.js` |

Booking record fields: bookingId, createdAt, status (pending, confirmed, completed, cancelled), scenario, items, collection, delivery, distanceKm, travelDuration, date, timeSlot, customer, quote, source. There is no online payment.

## Where things live

| What | File |
|---|---|
| Phone numbers, WhatsApp message, service-area chips, Google reviews link | `src/config/business.js` (only place for contact details) |
| Delivery rates, price format, estimate note | `src/config/rates.js` (only place for prices) |
| Calculator chips and WhatsApp message builder | `src/config/quote.js` |
| Page copy, services, FAQ, gallery, hero video | `src/config/content.js` |
| Google reviews (word for word) | `src/config/reviews.js` |
| Brand colours | theme tokens in `src/index.css` |

`client-assets/` holds the client's raw material (photos, videos, logo files, chat export). It is never imported, committed or deployed.

## Client details to confirm

**Rates and the quote calculator**
- Does exactly 10 km belong to R600 or R850? (Currently R600: each band includes its upper number. Same rule at 20, 30, 40, 50 and 60 km.)
- Is the price per trip regardless of load size?
- Are there extra charges (helpers, stairs, after-hours)? None are shown or mentioned until the client supplies them.

**Content**
- Kiru's WhatsApp number (+27 81 565 7009) and Sura's number (+27 67 294 1515).
- The exact suburbs for the "Where we deliver" chips. The current list is a draft of broad Cape Town areas.
- The three Google reviews (word for word) and the Google Business Profile link.
- Weekend delivery policy and whether helpers are offered (left out of the FAQ until confirmed).
- Domain name and which form service to use.
- Privacy policy wording (POPIA).

**Quick Book**
- Pricing values in `src/config/pricing.js`: base fee, minimum charge, per-item fees for all 18 items, and the stairs, evening and same-day surcharges. Until they are filled in, Quick Book shows "From R…" using only the distance rates.
- Whether Quick Book should keep using the distance bands, or a per-km rate (`perKmRate`, `includedKm`).
- Latest same-day booking time per slot (`leadMinutes`, currently 60 minutes before the slot ends).
- Maximum Quick Book distance (currently 60 km) and any areas to block.
- Whether "Book This Delivery" should save bookings (Firestore or an endpoint), or keep sending them on WhatsApp.
- A Google Maps API key if automatic road distance and address suggestions are wanted (Google bills for usage).

**Broader positioning (furniture, appliances and bulky items)**
- The logo's tagline reads "Furniture Delivery". Does the owner want an updated logo or tagline to match the broader offer? The site uses the current approved logo unchanged.
- Real photos of appliance collections (fridges, washing machines and so on). The Appliance delivery section uses a neutral truck photo until then.
- Size and weight limits: the largest item and heaviest load the trucks can take, and whether any appliance types are excluded. The site says every collection depends on size, weight, access, truck space and availability.
- Whether appliances need to be disconnected and ready before collection, and whether installation is offered. The site doesn't claim either.
- "Stores We've Collected From" (Hertex, Coricraft, Decofurn Furniture, Weylandts, Sofaworx, Bargain Buys, Ouhout, Tafelberg Furnishers, Die Handelshuis): confirm the list is accurate. Names are shown as text only. Retailer logos need each retailer's written permission first.
