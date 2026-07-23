# PlowOps — Snowplow Fleet Management App

Dispatch/admin panel + driver mobile app for a snow & ice removal operation
(demo company: *Summit Snow & Ice*, Denver–Aurora–Lakewood).

## What's here

| File | Purpose |
|------|---------|
| `Admin Panel.dc.html` | Dispatcher/office web app — dashboard, scheduling, route optimizer, fleet, equipment, staff, reports, repairs, billing, analytics. |
| `Driver App.dc.html` | Driver-facing mobile app — assigned route, stops, job photos, repair requests, timesheets. |
| `store.js` | Shared client-side data store + business rules (seeded demo data). |
| `support.js` | Runtime bootstrap (loads React/Babel from unpkg). |
| `icons.js` | Icon registration (Lucide). |
| `_ds/…` | "Automated Estimating" design system — tokens, styles, runtime bundle. |

Open `Admin Panel.dc.html` or `Driver App.dc.html` directly in a browser to run it.

## Current state (important)

This is a **self-contained front-end demo**. All data is seeded in `store.js`
and persisted to the browser's `localStorage` — it makes **no external API
calls today**. The map views, route optimizer, "emailed to client", and
"driver notified" behaviors are simulated. The UI even labels the placeholders
(e.g. *"in production this calls the Google Maps Directions API"*,
*"SATELLITE · GOOGLE MAPS STATIC API"*).

To turn this into a live product you'll (1) move the data layer from
`localStorage` into the repo's Postgres/Drizzle backend, and (2) wire the
features below to real services.

## API keys / environment variables to add on Railway

Set these as Railway service variables. **Required now / core:**

- `GOOGLE_MAPS_API_KEY` — one Google Maps Platform key. In Google Cloud, enable:
  **Maps JavaScript API** (live route map + GPS breadcrumbs), **Maps Static API**
  (satellite thumbnails on jobs/estimates), **Directions API** (route/stop
  optimizer, up to 100 stops per driver), **Geocoding API** (turn client
  addresses into lat/lng). Optionally **Places API** for address autocomplete.
  Restrict the key by API + HTTP referrer/IP before going live.

**Needed when moving off the demo data / enabling notifications:**

- `DATABASE_URL` — Postgres connection (Railway Postgres plugin). Replaces
  `localStorage` persistence; the repo already uses Drizzle.
- Transactional email (job receipts to clients, invoices) — pick one:
  `SENDGRID_API_KEY` **or** `RESEND_API_KEY`, plus a verified `MAIL_FROM` address.
- SMS notifications ("driver/client notified") — Twilio:
  `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.

**Optional / later:**

- Photo storage for driver job photos — e.g. Cloudinary
  (`CLOUDINARY_URL`) or S3 (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
  `S3_BUCKET`). Otherwise photos stay as base64 in the DB.
- Online payment collection for invoices/estimates — Stripe
  (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`).
- Weather/snowfall data — U.S. **National Weather Service API is free and
  needs no key**; OpenWeather (`OPENWEATHER_API_KEY`) if you want their data.

> None of these keys do anything until the integration code is written — the
> app won't call them while it's still running on the seeded demo data. Safe to
> add them ahead of time so they're ready.
