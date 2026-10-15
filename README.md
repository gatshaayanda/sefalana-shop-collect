# Shop & Collect — Sefalana branch pilot concept

A mobile-first prototype exploring liquor-category browsing, a local basket and collection-request planning for a proposed Sefalana Mogoditshane liquor-department pilot.

**This repository is a concept, not an official Sefalana service.** The beer, cider, wine, spirits and mixer listings and BWP prices are synthetic development fixtures, not real brands, store catalogue, live stock, current prices, promotions, or a confirmed collection service. Liquor is for adults aged 18+ only.

## Current prototype

- Customer storefront at `/`: browse liquor categories, search synthetic products, add/remove quantities, and review a sample basket.
- Catalogue workspace at `/admin`: add departments; add, edit, hide/publish and delete sample products.
- Demo catalogue and basket use this browser's local storage. Changes are not shared across devices and are not persisted to a server.
- The collection-request continuation deliberately explains that no order is submitted or collection slot booked.
- PWA metadata, app icon and service-worker cache namespace have been reset for Shop & Collect.
- Inherited operations login is disabled until dedicated staff authentication is implemented.

## Development

```bash
npm install
npm run dev
```

Quality checks to run locally before treating this checkpoint as verified:

```bash
npm run verify:identity
npx tsc --noEmit
npm run lint
npm run build
```

## Liquor pilot safety note

The Botswana Liquor Act restricts sale/delivery of intoxicating liquor to persons under 18. This prototype does not perform age verification, submit orders, verify stock, or book collection. Before any real pilot, the branch must approve product data, legal/compliance controls, operating hours, age checks at handover, collection workflow and customer data handling.

Official references: [Sefalana Liquor](https://www.sefalana.co.bw/our-stores/liquor) · [Botswana Liquor Act](https://www.gov.bw/sites/default/files/2020-03/LIQUOR%20ACT.pdf)

## PWA install verification

On a supported Android browser, verify the Shop & Collect install control invokes the browser's native install prompt when the browser exposes `beforeinstallprompt`. If the browser does not expose that event, verify the platform-specific fallback is accurate. After installation, check the home-screen name and icon, launch behavior, and service-worker/cache identity separately. A successful CI/build check alone does not prove installation works on a real device.

## Firebase configuration

`.env.example` contains the supplied public web configuration for Firebase project `sefalana-shop-collect`. Copy the values into local `.env.local` for development. Firebase web config does not create secure staff access or authorize Firestore/Storage operations. Keep service-account credentials separate, never commit them, and do not reuse credentials or production data from The Plug.

## Not implemented yet

- Shared server-side catalogue persistence and image uploads.
- Protected staff roles, authorization and audit history.
- Order submission, customer contact capture, order reference/history and status tracking.
- Branch-approved collection/delivery policy, configurable hours, lead times, cutoffs and capacity.
- Real product catalogue, prices, inventory source, payments or integrations.
- Production and real-device PWA verification.

See `AGENTS.md` for the operating contract, business assumptions and acceptance criteria. Do not present the prototype as ready for customer orders until the required workflows are implemented and verified.
