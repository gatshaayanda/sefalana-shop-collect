# Sefalana Shop & Collect — Agent Operating Contract

## 1. Product and authority

Build a polished, mobile-first grocery shopping and fulfilment PWA for a proposed pilot at Sefalana Hyper Mogoditshane.

Working name: Sefalana Shop & Collect. This is a provisional project name, not proof of Sefalana authorization. Do not claim official endorsement, ownership, integration, live inventory access, approved delivery service, or access to internal systems without evidence and permission.

The product owner is the final reviewer. Follow:
UNDERSTAND → INSPECT → PLAN → IMPLEMENT → VERIFY → CHECKPOINT.

Unexpected result = STOP → inspect actual state → identify the first failure → fix → verify.

Git and the actual repository are the source of truth. Do not claim work, tests, commits, pushes, integrations, or deployments succeeded without evidence. Do not deploy, merge, change live infrastructure, or incur material costs without explicit authorization.

## 2. Core customer experience

The customer journey is:
DISCOVER → BROWSE → SELECT → CHOOSE FULFILMENT → SUBMIT → RECEIVE CONFIRMATION → TRACK → COLLECT/RECEIVE → RETURN.

Customers must be able to:
- Browse and search products by department/category.
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

Do not invent real catalogue items, prices, specials, images, barcodes or stock. Any development fixtures must be synthetic and clearly marked as test data. A manually maintained availability flag is not live inventory integration.

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

Starting reference only: the official Sefalana Hyper Mogoditshane listing currently shows Monday–Saturday 08:00–20:00 and Sunday 08:00–18:00. The general Hyper page gives different standard hours and says branches may vary. Treat the branch-specific listing as provisional; make hours configurable and obtain branch confirmation before launch. Do not assume these are the approved shopping-service hours or cutoffs.

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
- Customer storefront with synthetic sample departments/products, search, department filters, quantity controls and a browser-local basket.
- `/admin` prototype for creating departments and adding/editing/hiding/publishing/deleting sample products.
- Clear demo-only disclaimers; the basket continuation does not submit an order.
- Updated package name, page metadata, manifest, icon, service-worker cache namespace and identity verification script.
- Replaced the inherited operations-login endpoint with a disabled response until project-specific staff authentication is designed.
- Supplied public Firebase web configuration added to `.env.example`; no service-account secret was supplied or configured.

Important gaps:
- Catalogue and basket data are browser-local only; there is no shared backend persistence.
- The admin prototype is not authenticated or authorized. It must not be used with real catalogue, prices or customer data.
- Product images are symbolic placeholders. Sample prices and availability are synthetic.
- No order submission, collection slot generation, staff fulfilment queue, image upload, payment, live stock integration or customer notifications are implemented.
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
