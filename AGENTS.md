# Sefalana Shop & Collect — Agent Operating Contract

## 1. Product and authority

Build a polished, mobile-first liquor-category shopping and collection-planning PWA for a proposed pilot with the Sefalana Mogoditshane liquor department. Do not assume whether the intended outlet is Block 2, Block 4 or the Hyper branch; confirm the authorized pilot location.

Working name: Sefalana Shop & Collect. This is a provisional project name, not proof of Sefalana authorization. Do not claim official endorsement, ownership, integration, live inventory access, approved delivery service, or access to internal systems without evidence and permission.

The product owner is the final reviewer. Follow:
UNDERSTAND → INSPECT → PLAN → IMPLEMENT → VERIFY → CHECKPOINT.

Unexpected result = STOP → inspect actual state → identify the first failure → fix → verify.

Git and the actual repository are the source of truth. Do not claim work, tests, commits, pushes, integrations, or deployments succeeded without evidence. Do not deploy, merge, change live infrastructure, or incur material costs without explicit authorization.

## 2. Core customer experience

The customer journey is:
DISCOVER → BROWSE → SELECT → CHOOSE FULFILMENT → SUBMIT → RECEIVE CONFIRMATION → TRACK → COLLECT/RECEIVE → RETURN.

Customers must be able to:
- Browse and search liquor products by category (beer, cider, wine, spirits, ready-to-drink and mixers).
- View product names, images, descriptions where available, prices, units and explicit availability.
- Add products and quantities to a basket; edit quantities and remove items.
- Choose collection or request delivery when delivery is enabled for their area.
- Choose from genuinely available fulfilment slots.
- Specify reasonable substitution preferences and instructions.
- Provide the minimum contact and fulfilment details needed to process an order.
- Receive a durable order reference and clear status; revisit their order without losing the reference.
- See unavailable products, changed prices, pending approvals, errors and next steps clearly.

Do not require app installation just to shop. Avoid unnecessary account creation before a customer can browse or submit a request. Protect private order details and provide a safe way to retrieve them.

A submitted request is not automatically an accepted order. Show the actual server-confirmed state. Do not promise stock, final prices, delivery, or collection readiness before staff verify them.

## 3. Department and product management

Staff with the appropriate role must be able to:
- Create, rename, reorder, publish/unpublish and archive departments.
- Create products inside a department and edit, publish/unpublish, archive or delete them when safe.
- Upload/change product images and see upload failures.
- Manage product name, description, department, SKU/barcode when available, unit/pack size, price in BWP, availability and relevant notes.
- Search and filter the catalogue and identify missing or invalid product data.
- See clear save success/failure feedback and verify changes after refresh.

Department creation and product creation must be connected: a product belongs to a valid department. Prevent accidental orphaned products. If a department has products or historical order references, prefer a safe archive/reassignment workflow over destructive deletion.

Use validated server-side writes. A hidden admin button or client-only route guard is not authorization. Protect upload, create, edit, archive and delete operations at the server/database boundary.

Do not invent real catalogue items, prices, specials, images, barcodes or stock. Current liquor products and prices are synthetic fixtures and must remain clearly marked as test data. Liquor sales are for adults 18+ only; this prototype does not verify age or submit orders. A real pilot requires branch-approved age checks, including at handover, and compliance review. A manually maintained availability flag is not live inventory integration.

## 4. Prices, availability and order integrity

- Store monetary values in a consistent exact representation; display BWP/Pula clearly.
- Store the price/unit and product identity captured when the order is submitted so later catalogue edits do not silently rewrite order history.
- Revalidate product availability, quantities, prices, fulfilment method and slot capacity on the server at submission.
- Never trust totals, prices, roles, status transitions or permissions supplied by the browser.
- Clearly distinguish estimated totals from confirmed totals, especially for variable-weight goods, substitutions or items requiring final weighing.
- Record price changes and customer approval where the final basket differs materially from the submitted basket.
- If an item becomes unavailable, offer the configured choice: contact customer, approved substitution, remove/refund according to the authorized payment policy, or another explicitly supported outcome.
- Do not invent payment methods, payment success, refunds or financial policies. Keep payment collection out of scope until the owner/branch approves the process.
- Use idempotent order submission and safe retry handling to prevent duplicate orders.

## 5. Fulfilment scheduling — mandatory

Scheduling must be driven by persisted, admin-configurable operating rules, not hard-coded opening-hour assumptions.

Support, as applicable:
- Separate collection and delivery availability.
- Configurable weekly operating hours and fulfilment cutoffs.
- Minimum preparation/picking time and minimum customer notice.
- Slot intervals, order capacity and any item/order limits.
- Capacity shared by overlapping fulfilment work where operationally appropriate.
- Delivery zones, fees and capacity only after the branch confirms them.
- Holidays, exceptional closures, temporary pauses and one-off hour changes.
- A configurable booking horizon and a clear full/unavailable state.

Generate only slots that fit the configured service window and leave enough time for preparation and handover before the relevant cutoff. A store being open does not mean a new order can be prepared immediately. Do not offer slots outside service hours or after the final feasible preparation start.

Revalidate the selected slot, operating rules, capacity and order on the server when submitting. Prevent concurrent requests from exceeding capacity. A slot displayed to a customer is not reserved until the server confirms it.

Official Sefalana listings show separate liquor outlets in Mogoditshane (Block 2 and Block 4), distinct from Sefalana Hyper Mogoditshane. The exact intended pilot outlet and its approved hours must be confirmed with the branch; do not silently assume a branch, operating window or collection cutoff. See https://www.sefalana.co.bw/stores?type=liquor.

Official references:
- https://www.sefalana.co.bw/stores?store=sefalana-hyper-mogoditshane
- https://www.sefalana.co.bw/our-stores/hyper

Apply the safe scheduling principle used in Tripple S: derive slots from configured hours, lead time, duration/preparation, buffers, conflicts, capacity and exceptions; recheck on submission; do not invent availability. Sefalana uses picking and fulfilment capacity rather than spa appointment capacity.

## 6. Order lifecycle and staff operations

Model order states explicitly. A proposed lifecycle is:
submitted → accepted/rejected → picking → exception/customer decision if needed → checked/priced → ready for collection or out for delivery → completed.

Support cancellation, expiry, failure and other transitions only with defined rules. Validate every transition server-side and record who performed it and when.

Staff must be able to:
- See a useful order queue and filter by status, date and fulfilment method.
- Open an order and view its captured items, quantities, customer instructions and requested slot.
- Record picking progress and unavailable items.
- Request/record customer decisions on substitutions or price changes.
- Confirm the final basket and amount.
- Mark an order ready only after the required checks are complete.
- Record collection/handover or delivery completion with appropriate evidence.
- See failures and recover safely without silently duplicating or losing work.

Customer-facing status must reflect persisted operational state. A button click alone is not proof that an order was saved, accepted, prepared, notified, collected or delivered.

## 7. Roles, authentication and privacy

Define least-privilege roles for at least branch manager, catalogue management and fulfilment staff when the project needs them. A manager can manage staff access and branch settings only through an authorized workflow.

- Enforce authorization on server/API/database/storage boundaries, not only in the UI.
- Do not reuse The Plug's operational password, Firebase project, credentials, customer data or production infrastructure.
- Use a separate approved Firebase project/environment for this application. Never commit secrets.
- Do not expose private order details in public catalogue queries, logs, analytics or notifications.
- Collect only the personal information needed to fulfil orders; define access, retention and deletion behavior.
- Validate uploaded image type/size and access; never trust client-supplied file metadata.
- Audit sensitive actions: catalogue/price changes, order state changes, overrides, staff access and fulfilment completion.
- Keep admin access discreet but discoverable to authorized staff; do not use an unprotected secret URL or client-side-only password as the security boundary.

## 8. Branch policy and business assumptions

For the liquor pilot, age restriction and responsible-sale controls are mandatory business requirements. Botswana's Liquor Act section 32 restricts sale/delivery of intoxicating liquor to persons under 18. This demo has no age-verification or handover workflow and must not be treated as capable of accepting real liquor orders. Official references: https://www.gov.bw/sites/default/files/2020-03/LIQUOR%20ACT.pdf and https://www.sefalana.co.bw/our-stores/liquor.


This is a proposed branch pilot. Confirm with the authorized branch/company representative before treating any of these as settled:
- Brand, logo, product images and use of company marks.
- Catalogue ownership and the permitted source of product data.
- Prices, stock/availability source, promotions and update responsibilities.
- Whether collection and/or delivery are approved; delivery zones, fees and responsibility.
- Opening hours, fulfilment hours, cutoffs, slot capacity and staffing.
- Payment, cancellation, refund, substitution and customer-contact policies.
- Data permissions, retention, integrations and rollout approval.

Until confirmed, implement configurable policies and honest request-based workflows. Do not pretend to integrate with Sefalana's existing apps, online shop, inventory, rewards, payments or internal systems.

Design the service to complement existing Sefalana digital channels rather than cloning rewards/promotions without a clear approved need.

## 9. Product quality and design

Aim for a dependable retail experience, not a generic admin template:
- Clear product photography, legible prices, obvious department navigation and a usable basket.
- Mobile-first layout, fast interactions, restrained visual hierarchy and consistent spacing.
- Strong contrast, visible keyboard focus, accessible labels and meaningful button text.
- Loading, empty, offline, validation, permission and server-error states.
- No fake counters, invented reviews, false urgency, placeholder products presented as real, or unsupported claims.
- Preserve customer input when recoverable errors occur.
- Make status and next action understandable without technical knowledge.

Use WCAG 2.2 AA contrast as the baseline: 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/icons. Test mobile and desktop layouts and keyboard navigation.

## 10. PWA, connectivity and notifications

Browsing cached/public catalogue content may be supported offline, but submitting orders, checking current availability, confirming slots and changing order state require a successful server response.

- Never present stale cached availability as guaranteed live stock.
- Never claim an order was submitted while offline or before server confirmation.
- Use safe retry/idempotency behavior after connectivity returns.
- Do not cache private order/account/admin data in the public service-worker cache.
- Reset app identity: title, metadata, manifest, icons, theme, canonical URL, service-worker cache namespace, browser storage namespace and inherited customer-facing copy.
- Installation is optional and separate from offline support.
- Notifications are optional enhancements. Permission does not prove delivery or device receipt. The order status page remains authoritative.
- Do not carry over The Plug's source-brand identity or service credentials.

## 11. Architecture and resource discipline

Before changing a workflow, trace:
UI → event handler → API/server validation → authorization → persistence → resulting customer/staff state.

Inventory inherited routes, APIs, data helpers, Firestore/Storage rules, indexes, environment variables, scheduled jobs, workflows, service-worker behavior and dependencies. Classify inherited functionality KEEP / ADAPT / REPLACE / EXCLUDE. Preserve reusable mechanisms, not unrelated business logic.

Prefer the smallest controlled change. Avoid duplicate controllers, speculative dependencies, unbounded listeners, repeated reads, unsafe writes and unnecessary paid services. Paginate/bound queries, detach listeners when no longer needed, keep analytics minimal and define retry, retention and failure behavior.

Do not add bulk catalogue import, advanced reporting, external inventory integration or payment integration ahead of a verified basic customer order and staff fulfilment flow unless the brief or evidence makes it necessary.

## 12. Required verification

For each acceptance criterion record: expected behavior, test procedure, environment, observed result and remaining gap.

Use:
- PASS — executed and acceptance criteria met.
- FAIL — executed and criteria not met.
- NOT RUN — not executed.
- BLOCKED — specific dependency or permission prevents execution.

At minimum verify:
1. Admin authentication and unauthorized access denial.
2. Create department → create product/image/price → refresh → customer sees correct published product.
3. Edit, hide/archive and safe deletion behavior.
4. Basket quantities, validation and server-calculated totals.
5. Submit order → durable reference → staff queue → state transition → customer sees updated persisted status.
6. Unavailable item/substitution and changed-price handling.
7. Collection and delivery slot generation, cutoff/preparation rules, full capacity, closure/holiday exception and server-side revalidation.
8. Duplicate submit/retry, slow network, offline browsing and failed server writes.
9. Image upload validation, storage rules and unauthorized writes.
10. Mobile/desktop, keyboard/accessibility, loading/empty/error states.
11. Identity verification, manifest/icons/service worker and cache isolation.
12. Relevant lint, TypeScript, build, rules/emulator tests and `git diff --check`.

Source inspection, automated checks, emulator tests, browser/device testing and deployed behavior are different evidence levels. A successful build is not proof that authentication, storage, orders, scheduling, notifications or production integrations work.

## 13. Current checkpoint and reporting

Repository: `gatshaayanda/sefalana-shop-collect`, branch `main`, remote `https://github.com/gatshaayanda/sefalana-shop-collect.git`.

Confirmed pushed foundation checkpoints:
- `d8a384d` — `chore: establish Sefalana Shop & Collect foundation`.
- `44d0f19` — `docs: define Sefalana Shop and Collect requirements`.

Initial customer/admin prototype and identity-reset changes have since been committed directly to `main` through GitHub's file API. The exact current branch head must be rechecked before reporting the final checkpoint.

Implemented at source level:
- Customer storefront with synthetic liquor departments/products, search, department filters, quantity controls and a browser-local basket. Storage namespace v2 resets prior grocery demo catalogues and baskets for returning browsers.
- `/admin` prototype for creating departments and adding/editing/hiding/publishing/deleting sample products.
- Clear demo-only disclaimers; the basket continuation does not submit an order.
- Updated package name, page metadata, manifest, icon, offline screen, service-worker cache namespace and identity verification script. Legacy The Plug service-worker caches are deleted on activation.
- PWA installation remains optional; the inherited embedded-browser install gate no longer blocks browsing.
- Replaced the inherited operations-login endpoint with a disabled response until project-specific staff authentication is designed.
- Supplied public Firebase web configuration added to `.env.example`; no service-account secret was supplied or configured.

Important gaps:
- Catalogue and basket data are browser-local only; there is no shared backend persistence.
- The admin prototype is not authenticated or authorized. It must not be used with real catalogue, prices or customer data.
- Product images are symbolic placeholders. Liquor product names, sample prices and availability are synthetic.
- Store-reference photography is wired to `/public/images/sef1.jpeg`, `sef2.jpeg` and `sef3.jpeg`; these reference images are present in the repository. Product image upload is not yet enabled in the admin UI. Product image upload is not yet enabled in the admin UI. UploadThing's inherited route currently has no verified staff authorization, so do not expose upload controls until an authenticated admin boundary is implemented and tested.
- No order submission, collection slot generation, staff fulfilment queue, payment, live stock integration or customer notifications are implemented.
- Full inherited route/data/security review and deployment/runtime validation remain outstanding.

Verification status at this checkpoint:
- Source inspection: PASS for the changed file contents as retrieved from GitHub.
- Identity verifier, TypeScript, lint and build: NOT RUN in a local runtime.
- Browser/mobile interaction and persistence testing: NOT RUN.
- Firebase rules/auth/storage and server integration testing: NOT RUN.
- Deployment/production behavior: NOT RUN; no explicit deployment action was performed by the implementation agent.

After meaningful work:
- Inspect the actual diff and check for regressions.
- Run applicable checks and record their results.
- Update this file when requirements, architecture, decisions or project state materially change.
- Commit verified work locally when appropriate.
- Push only when authorized. Do not deploy unless explicitly requested.

Final checkpoint reports must state repository, branch, commit, changed files, verification evidence, deployment state, unresolved issues and next action.


## 14. Storefront shopping hierarchy and interaction feedback

The customer storefront must feel like a shop, not a long proposal or editorial landing page. Preserve the established brand styling and supplied store photography while prioritizing shopping actions:
- Keep the concept-preview/18+ sample-data disclosure visible.
- Use a compact welcome hero; place category filters, search and product cards before the longer store story and how-it-works explanation.
- Product cards must make the product name, pack/unit, Botswana pula price (displayed with a clear `P` prefix), and an obvious Add action easy to scan.
- Keep the basket control in the header visibly actionable (icon, explicit “View basket” wording, count and directional cue). It must open and scroll to the basket review section.
- When the basket has items on mobile, show a fixed, accessible basket summary with item count, sample subtotal and explicit “Tap to review basket” guidance. It must not obscure the page content or product controls.
- Provide short, accessible confirmation feedback for add/quantity changes. Loading or transition animation must be brief and must not imply a network request or order submission when none exists.
- Preserve category/search behavior, local basket persistence, quantity controls and the truthful non-live-ordering disclaimers. Do not imply that basket review submits an order.
- Keep keyboard focus visible, use accessible names and live status feedback, and respect reduced-motion preferences when adding animation.

## 15. Storefront redesign checkpoint — 2026-10-16

A controlled storefront shopping-flow change is in progress on branch `feat/storefront-shopping-flow`; do not describe it as merged or deployed until verified.

Planned/changed source files:
- `src/app/page.tsx`: compact hero; product discovery moved ahead of store-story/how-it-works content; explicit header basket action; basket review scroll target; mobile basket summary; transient add/quantity toast and add-button feedback.
- `src/app/shop.css`: clear basket affordance, responsive two-column mobile product grid, sticky basket summary, toast/feedback animations and responsive spacing.
- `src/lib/demo-catalogue.ts`: format illustrative prices as Botswana pula with a `P` prefix.

Known limits remain unchanged: the catalogue and basket are browser-local, products/prices are synthetic, and no real order, age verification, stock, collection slot or delivery workflow is connected.

Verification at this checkpoint: remote source edits only. Local TypeScript/lint/build, browser interaction tests, real-device tests and deployed behavior are NOT RUN. Before merge, retrieve and inspect the full diff; run project checks in a usable runtime; verify mobile and desktop basket navigation, category/search, quantity/subtotal updates, persistence, accessibility, and animation behavior. If checks cannot run, report the precise blocker and do not claim PASS.


## 16. Cross-device responsive layout guard — 2026-10-16

Commit `c67c9a97d8eb2f62ca6e834c96d54d1ab077ca2b` adds scoped storefront/staff-workspace responsive guards in `src/app/shop.css`: viewport-bounded containers, min-width safeguards for grid/flex children, bounded media, mobile heading and header sizing, responsive basket summary safe-area spacing, and a single-column staff layout below tablet width. It also adds a narrow-screen breakpoint for devices at or below 360px.

Acceptance criteria:
- No page-level horizontal overflow or black/dead strip at 320px, 360px, 390px, tablet, and desktop widths.
- Main hero heading, header actions, search, product grid, basket controls and staff forms remain fully visible and operable.
- Horizontal scrolling remains intentional only for the category-chip row.
- Existing product discovery, basket, analytics/PWA and admin behavior remain unchanged.

Verification status at checkpoint: source change pushed directly to `main` as requested. Automated workflow, production deployment, browser viewport matrix and physical-device tests are NOT RUN until their results are retrieved. Do not claim visual verification from CSS inspection alone.

## 15. Offline/PWA hardening checkpoint — 2026-10-16

Source changes pushed directly to `main`:
- `public/sw.js`: Firebase Messaging imports are fail-soft so a CDN/config outage does not prevent the core worker from installing; shell precaching errors no longer abort installation; the worker accepts an explicit `PRECACHE_SHELL` retry; only the public storefront and offline screen are eligible for navigation caching. Admin/private routes remain network-only and fall back to the offline screen. Push notification links are constrained to the app's own origin.
- `src/app/pwa-register.tsx`: on reconnection, request a service-worker update and retry shell precaching.
- `public/manifest.webmanifest`: corrected the inherited grocery identity to the proposed liquor-department pilot identity.
- `scripts/verify-identity.mjs`: identity verifier now expects the corrected manifest name.

Offline contract: previously cached storefront shell/static assets and this browser's local demo catalogue/basket may remain usable after an initial successful online load. Fresh stock/prices, server APIs, authenticated actions, notifications and any real order/fulfilment operations are not guaranteed offline; the concept has no real order submission or shared backend. Push delivery itself requires the platform/device to be able to receive it. Do not describe the entire service as identical offline.

Verification at checkpoint:
- Source changes and individual GitHub commits: PASS (pushed to `main`).
- Source-level review of the intended guards: PASS.
- Identity verifier, TypeScript, lint, production build: NOT RUN in a project runtime.
- Browser offline/online toggle, cold offline launch, Cache Storage inspection, real-device install, push receipt and deployed smoke test: NOT RUN.
- Deployment state: check Vercel separately; a source push is not proof of a successful build or live behavior.


## 17. Basket narrow-screen clipping fix — 2026-10-16

Commit `5ee8c4dbba1d585a12877bdc8b340e2dc5083598` adds a scoped CSS correction in `src/app/shop.css`:
- The basket disclosure button now overrides the inherited fixed 40px button width, so “Show items ↓” / “Hide items ↑” can render at their natural readable width.
- Basket header content can wrap without pushing the count/control off-screen.
- The basket panel, sample subtotal, and disclaimer are constrained to the viewport; subtotal values remain unbroken and the disclaimer wraps.
- The narrowest breakpoint uses smaller panel gutters.

Scope is intentionally limited to the basket layout; catalogue content, product styling, basket state/logic, prices, and disclaimer wording are unchanged.

Verification status: source change pushed directly to `main`; no browser viewport or physical-device test has been run for this specific fix. Check deployed behavior at 320px, 360px, 390px and a desktop width before claiming visual PASS.


## 18. Offline admin shell correction — 2026-10-17

Commits `4bd7b3142b69ebabbc6238b3a6c26934e455a05c` and `83e3e90e68ea1d83b622308fe07b7b89b5f104af` update `public/sw.js` and `src/app/pwa-register.tsx`. The browser-local `/admin` demo is included in the install-time shell precache and is cached after a successful online visit. When offline, direct navigation to `/admin` now falls back to its own cached route instead of being classified with network-only account/order routes. The PWA registration also explicitly retries shell precaching for an already-active worker and after a newly installed worker activates, addressing the case where fail-soft install-time precaching left the offline shell incomplete. Account, request, order and invite pages remain network-only; API requests remain excluded from the public cache.

Scope and safety:
- This only makes the existing prototype admin interface and its browser-local demo catalogue available offline on that same device after the route has been cached. It does not create shared persistence, staff authentication, server authorization, or real administration capability.
- `/admin` remains an unauthenticated demo and must not be used for real business data.
- Installation-time precaching can only cache the route if the deployment successfully serves it when precaching runs. A route cache miss falls back to the offline screen; no route is fabricated.
- Source inspection: PASS for the intended route policy in `public/sw.js`.
- GitHub write to `main`: PASS.
- TypeScript/lint/build, browser offline toggle, cold offline launch, admin form persistence after offline reload, Cache Storage inspection, real-device test, and deployed runtime: NOT RUN. Do not claim that the deployed PWA has passed offline testing until these are executed.
