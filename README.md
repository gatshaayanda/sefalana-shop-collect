# Shop & Collect — Sefalana branch pilot concept

A mobile-first prototype exploring a grocery browsing and collection-planning flow for a proposed Mogoditshane branch pilot.

**This repository is a concept, not an official Sefalana service.** Sample products and BWP prices are synthetic development fixtures, not store catalogue, live stock, current prices, promotions, or a confirmed collection service.

## Current prototype

- Customer storefront at `/`: browse departments, search sample products, add/remove quantities, and review a sample basket.
- Catalogue workspace at `/admin`: add departments; add, edit, hide/publish and delete sample products.
- Demo catalogue and basket use this browser's local storage. Changes are not shared across devices and are not persisted to a server.
- The checkout continuation deliberately explains that no order is submitted.
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
