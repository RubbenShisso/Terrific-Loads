# Terrific Loads website

Furniture and large-item collection and delivery in Cape Town. React + Vite + Tailwind CSS v4, Motion for animation, Lucide icons.

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

All optional. The site works without any of them.

| Variable | Purpose |
|---|---|
| `VITE_LOCATION_SEARCH_URL` | Address suggestions use the free Photon service (OpenStreetMap data) by default. Set this to a self-hosted Photon URL if traffic grows. |
| `VITE_ROUTING_URL` | Driving distance uses free OSRM routing on OpenStreetMap data (the FOSSGIS server behind openstreetmap.org) by default. Set your own OSRM server URL for heavier use. |
| `VITE_GOOGLE_MAPS_API_KEY` | Works out the driving distance with the Google Routes API instead. Address suggestions still use OpenStreetMap until Google Places is added. Restrict the key to the site's domain. |

Copy `.env.example` to `.env` to set them locally.

## Quote flow

One quote form (`src/components/quote/QuoteFlow.jsx`) on the home page and the quote page, following the client's brief:

1. **Items:** Couch / Sofa, Table, Chairs, Fridge, Bed / Mattress, Wardrobe, or Other with a description, each with a quantity.
2. **Addresses:** collection and delivery, plus "Do you need us to collect from or deliver to more than one location?". Yes adds stops, each with collect or deliver, an address and what happens there. The driving distance is worked out through every stop in order.
3. **Delivery option:** Standard, Express (standard + R150), Scheduled or a Budget-Friendly Request, in the client's wording.
4. **Details:** preferred date, name, contact number and notes, then "Get a delivery quote on WhatsApp" opens WhatsApp with everything filled in.

Indicative prices are shown only for one item on a single route whose driving distance was found and is 60 km or less. Multiple items, extra stops, addresses that can't be found, routes that can't be worked out and routes over 60 km get no price: the customer is asked to send the details for a quote on WhatsApp. No price is shown before both addresses are in. There is no online booking or payment. A 50% deposit is arranged on WhatsApp after the job is agreed.

Popular items' "Get a quote" buttons add the item to the form on the home page, or open `/quote?item=<id>`. The "Where we deliver" chips fill in the delivery address. Progress is kept for the browser tab.

## Where things live

| What | File |
|---|---|
| Phone numbers, WhatsApp message, service-area chips, Google reviews link | `src/config/business.js` (only place for contact details) |
| Delivery prices, Express surcharge, price note | `src/config/rates.js` (only place for prices) |
| Quote items | `src/config/items.js` |
| Delivery options, when a price may be shown, WhatsApp message | `src/config/quote.js` |
| Page copy, services, FAQ, gallery, hero video | `src/config/content.js` |
| Google reviews (word for word) | `src/config/reviews.js` |
| Brand colours | theme tokens in `src/index.css` |
| Page titles, descriptions, sitemap and SEO tags | `src/config/seo.js` (add a page here and it appears in the sitemap) |

## SEO and sitemap

`npm run build` writes, from the page list in `src/config/seo.js`:

- each page's title, description, canonical link, Open Graph and Twitter tags (the 404 page gets `noindex` instead),
- `dist/sitemap.xml` with every indexable page,
- `dist/robots.txt` pointing search engines at the sitemap.

Visitors get a readable sitemap at `/sitemap`, linked from the footer. All absolute URLs use `business.siteUrl`, so set the real domain there before launch, then submit `https://<domain>/sitemap.xml` in Google Search Console. LocalBusiness structured data comes from `src/components/layout/BusinessSchema.jsx`.

`client-assets/` holds the client's raw material (photos, videos, logo files, chat export). It is never imported, committed or deployed.

## Client details to confirm

**Prices and the quote flow**
- Prices (client brief): up to 10 km R650, over 10 to 20 km R850, over 20 to 30 km R1 000, over 30 to 40 km R1 200, over 40 to 50 km R1 500, over 50 to 60 km R1 700. Express is R150 more. Each band includes its upper number, so exactly 10 km is R650.
- Is a quantity above one of the same item (for example four chairs) a multiple-item job? The site currently treats it as one and asks for a WhatsApp quote.
- The form allows up to 6 extra stops. Is that enough?

**Content**
- Kiru's WhatsApp number (+27 81 565 7009) and Sura's number (+27 67 294 1515).
- The exact suburbs for the "Where we deliver" chips. The current list is a draft of broad Cape Town areas.
- The three Google reviews (word for word) and the Google Business Profile link.
- Weekend delivery policy and whether helpers are offered (left out of the FAQ until confirmed).
- Domain name (set `siteUrl` in `src/config/business.js`; the sitemap, canonical links and share images use it).
- Privacy policy wording (POPIA).

**Google Maps (optional)**
- A Google Maps API key with Places API (New) and Routes API, if better address search and Google road distances are wanted (Google bills for usage beyond its free allowance).

**Broader positioning (furniture, appliances and bulky items)**
- The logo's tagline reads "Furniture Delivery". Does the owner want an updated logo or tagline to match the broader offer? The site uses the current approved logo unchanged.
- Real photos of appliance collections (fridges, washing machines and so on). The Appliance delivery section uses a neutral truck photo until then.
- Size and weight limits: the largest item and heaviest load the trucks can take, and whether any appliance types are excluded. The site says every collection depends on size, weight, access, truck space and availability.
- Whether appliances need to be disconnected and ready before collection, and whether installation is offered. The site doesn't claim either.
- "Stores We've Collected From" (Hertex, Coricraft, Decofurn Furniture, Weylandts, Sofaworx, Bargain Buys, Ouhout, Tafelberg Furnishers, Die Handelshuis): confirm the list is accurate. Names are shown as text only. Retailer logos need each retailer's written permission first.
