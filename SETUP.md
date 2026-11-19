# MyFirstNight: setup for reviews, tracking and pincode/COD

## 1. Reviews (two layers, both real)

**A. Star ratings on cards & product pages**
Install a review app (Judge.me, Loox, Okendo, Shopify's Product Reviews). They write the
standard product metafields `reviews.rating` and `reviews.rating_count`. The site reads
those automatically. Make sure the metafield definitions are exposed to the Storefront API
(Settings → Custom data → Products → "reviews.rating" → Storefront access ON).

**B. Written reviews you control (metaobjects)**
Settings → Custom data → Metaobjects → Add definition. Type handle: `review`. Fields:

| key       | type                | note                              |
|-----------|---------------------|-----------------------------------|
| author    | Single line text    | first name + initial              |
| rating    | Integer             | 1–5                               |
| title     | Single line text    | optional                          |
| body      | Multi-line text     | required                          |
| location  | Single line text    | city                              |
| date      | Date                | for sorting                       |
| verified  | True/false          | shows "Verified purchase"         |
| featured  | True/false          | shows on the homepage carousel    |
| product   | Product (reference) | links the review to a product     |

Turn ON "Storefront API access" for the definition. Only add reviews from real customers
who agreed to be quoted. Product pages show reviews + rating schema (rich stars in Google);
the homepage "Words from Our Clients" shows the `featured` ones and stays hidden when none.

## 2. Tracking
1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.
2. Optional server-side Meta events: `NEXT_PUBLIC_META_CAPI=true` + `META_CAPI_ACCESS_TOKEN`
   (use `META_TEST_EVENT_CODE` from Events Manager → Test events while testing).
3. Purchases happen on Shopify's checkout: paste `docs/shopify-custom-pixel.js` into
   Shopify Admin → Settings → Customer events → Add custom pixel.
4. Events on the site: page_view, view_item, add_to_cart, begin_checkout, search, lead
   (concierge request). All wait for cookie consent (accept/decline banner).
5. Verify in GA4 DebugView and Meta Test events before running ads.

## 3. Pincode, COD & delivery estimate
Fill the `SHIPROCKET_*` variables (create an API user in Shiprocket → Settings → API).
Product pages then show city, an estimated delivery window and "Cash on delivery available".
Without Shiprocket, the checker only validates the pincode and says delivery is confirmed
at checkout. It never claims COD.
COD must also be enabled as a payment method in Shopify (or via your COD app) for the
badge to be true at checkout.

## 4. Gift builder (/gift-builder)
Customers choose up to 3 pieces, add a monogram, recipient and note. These travel to the
Shopify order as **line-item properties** ("Monogram", "Gift for", "Gift note"), visible in
Orders → the order → line items, so your team can prepare it.

Bundle privilege: create a discount code in Shopify Admin → Discounts (e.g. 10% off, minimum
quantity 2), then set `NEXT_PUBLIC_GIFT_BUNDLE_CODE` and `NEXT_PUBLIC_GIFT_BUNDLE_LABEL`.
It is applied when 2+ pieces are added and validated by Shopify in the bag. If the code is not
valid it is removed automatically. Leave both empty to offer no bundle discount.
Personalised pieces are marked non-returnable in the builder (matches the returns policy text).

## 5. Abandoned-cart recovery (three layers)

1. **Shopify's own recovery emails (do this first, it is free).**
   Settings → Checkout and customer accounts → Abandoned checkouts → "Automatically send".
   Customise the template with your brand voice. The site now pre-fills the shopper's email
   at checkout when it already knows it (newsletter sign-up or "Email me my bag"), so Shopify
   can follow up even if they leave before typing it again.
2. **"Not ready? Email me my bag" in the bag.** Creates a real Shopify cart with the buyer
   email attached and sends a branded email with a private "Return to my bag" link
   (`/bag/restore`). Needs a Resend account: verify your sending domain, then set
   `RESEND_API_KEY` and `RESEND_FROM`. Optional tick-box also subscribes them to marketing.
   Limits: 3 emails/hour per address. Restore links stop working once Shopify expires the cart.
3. **Later (optional):** Klaviyo or Shopify Flow for timed multi-step reminders and WhatsApp
   follow-ups. This needs consented phone numbers and an approved WhatsApp Business API
   provider, so I have not added it.

## 6. Hero video
1. Shoot or buy 15–20 seconds of slow, silent footage (silk moving, light on fabric, hands on a
   monogram seal). No faces needed. Keep it dark and low-contrast so the headline stays readable.
2. Encode small and loop-friendly:
   ```
   ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 28 -preset slow -movflags +faststart hero.mp4
   ffmpeg -i source.mov -an -vf "scale=720:-2,fps=24" -c:v libx264 -crf 29 -preset slow -movflags +faststart hero-mobile.mp4
   ```
   Aim for under ~6 MB desktop, ~2 MB mobile.
3. Put `hero.mp4`, `hero-mobile.mp4` and `home-banner.png` (poster, also the fallback) in `/public`, then set
   `NEXT_PUBLIC_HERO_VIDEO_URL=/hero.mp4` and `NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL=/hero-mobile.mp4`.
The hero shows the still image instead when the visitor prefers reduced motion or has data-saver on,
and shows a pause button once the video plays.

## 7. Lookbook (/lookbook)
Edit it from Shopify, no code: Settings → Custom data → Metaobjects → add definition,
type handle `lookbook_chapter`, Storefront access ON, fields:

| key      | type                          | note                                  |
|----------|-------------------------------|---------------------------------------|
| title    | Single line text              | chapter name                          |
| subtitle | Single line text              | optional                              |
| story    | Multi-line text               | short editorial paragraph             |
| image    | File (image)                  | full-screen chapter opener            |
| products | List of products              | shown as looks + "Shop the look"      |
| order    | Integer                       | 1, 2, 3… for sequence                 |

Without any chapters, the page builds itself from your Shopify collections.

## 8. Journal (/journal), fetched live from Shopify
Publish in Shopify Admin → Online Store → Blog posts. The site reads **every blog** (or only the
one in `NEXT_PUBLIC_JOURNAL_BLOG_HANDLE`) straight from the Storefront API: title, featured image,
excerpt, body, tags, author and SEO fields. Nothing is hard-coded. New posts show within about
a minute. Set `REVALIDATE_SECRET` and call `/api/revalidate?secret=...` to refresh instantly.

## 9. Lookbook (/lookbook), fetched live from Shopify
Chapters come from the `lookbook_chapter` metaobject (section 7); with none, it uses your
collections. Same ~1-minute refresh.

## 10. If journal or lookbook shows empty
Open `/api/shopify-check?secret=YOUR_REVALIDATE_SECRET`. It reports Shopify's exact error. The usual causes:
- Storefront API token is missing the **"Read content"** (blogs/articles) or **"Read metaobjects"** scope
  (Shopify Admin → Settings → Apps → Develop apps → your app → Storefront API scopes). Re-save and use the new token.
- Metaobject definition has Storefront access OFF, entries are Draft, or the type handle isn't exactly `lookbook_chapter`.
- Articles are hidden/unpublished.

## 11. Launch checklist
- [ ] `npm install && npm run build` passes with your real `.env.local` (build needs Shopify reachable so pages render with real data)
- [ ] `npm run lint` and `npm run typecheck` pass (both are clean as shipped)
- [ ] Next.js is on 14.2.35 (the patched release line); keep it updated: `npm outdated`
- [ ] `public/home-banner.png` added (hero + social share image)
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER`, contact email and legal name set
- [ ] Storefront token scopes: products, content, metaobjects (check `/api/shopify-check`)
- [ ] Policies reviewed (return window, dispatch time) and a lawyer has seen them
- [ ] One real order placed end to end (discount code, gift set, pincode, COD if used)
- [ ] GA4 DebugView and Meta Test Events show the events; custom pixel pasted for purchases
- [ ] Shopify abandoned-checkout emails switched on; Resend domain verified
- [ ] Set `REVALIDATE_SECRET` (long random string) and keep it private
