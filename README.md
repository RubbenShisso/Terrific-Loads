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

Copy `.env.example` to `.env` to set it locally.

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

**Broader positioning (furniture, appliances and bulky items)**
- The logo's tagline reads "Furniture Delivery". Does the owner want an updated logo or tagline to match the broader offer? The site uses the current approved logo unchanged.
- Real photos of appliance collections (fridges, washing machines and so on). The Appliance delivery section uses a neutral truck photo until then.
- Size and weight limits: the largest item and heaviest load the trucks can take, and whether any appliance types are excluded. The site says every collection depends on size, weight, access, truck space and availability.
- Whether appliances need to be disconnected and ready before collection, and whether installation is offered. The site doesn't claim either.
- "Stores We've Collected From" (Hertex, Coricraft, Decofurn Furniture, Weylandts, Sofaworx, Bargain Buys, Ouhout, Tafelberg Furnishers, Die Handelshuis): confirm the list is accurate. Names are shown as text only. Retailer logos need each retailer's written permission first.
