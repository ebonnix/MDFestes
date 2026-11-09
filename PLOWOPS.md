# MDF PlowOps — dispatch & proof-of-service app

Lives inside the main MDFestes site at **https://mdfestes.com/plow** (same server, same database, same Railway deploy).

## Roles
- **Owner / admin** (`/plow/admin`): creates driver logins, manages properties (geocoded automatically), assigns addresses to drivers per service date, reorders / auto-optimizes routes, watches live truck positions, reviews the proof log, exports the liability CSV, re-sends owner notifications.
- **Driver** (`/plow/driver`): logs in, sees today's stops in order on a map, taps Navigate (opens Google Maps with the phone's GPS), I'm here, **Prove it's plowed** (camera → GPS → stamped photo → upload → owner notified), Complete (services + material + notes) or Skip (reason).
- **Property owner**: receives text/email with the stamped photo and a link to `/plow/proof/<token>`.

## Proof photo stamp
Burned into the JPEG, bottom-right, 10% of the image height, right-justified:
`MDF ESTES PARK · PROOF OF SERVICE` / address / `LAT … LON … ±accuracy` / `MM/DD/YYYY hh:mm:ss MT` / `DRIVER: name`.

## Location
1. Device GPS (high accuracy, then quick fallback) — works in Safari/Chrome on iOS/Android once the driver allows Location.
2. If no fix: the property's geocoded coordinates (stamp marked "(property)").
3. If none: manual entry (stamp marked "(manual)").
Server computes distance from the property pin and flags >150 m. Weather (Open-Meteo) is attached to every proof.
Photos taken with no signal are queued in the phone (IndexedDB) and upload automatically when back online.

## First run
Open `/plow`, click through the setup screen with the website admin password (`ADMIN_PASSWORD`), create the owner account.

## Railway environment variables (all optional — app works without them)
| Var | Purpose |
|---|---|
| `GOOGLE_MAPS_API_KEY` | server-side geocoding (falls back to OpenStreetMap/Nominatim) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps in the browser (falls back to OpenStreetMap tiles). Build-time var. |
| `RESEND_API_KEY`, `PLOW_FROM_EMAIL` | email proof to owners (resend.com; verify mdfestes.com domain) |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | MMS/SMS proof to owners |
| `APP_BASE_URL` | defaults to https://mdfestes.com (used in links) |
| `JWT_SECRET` | signs plow sessions (already used by the site) |

Database tables (`plow_users`, `plow_properties`, `plow_routes`, `plow_stops`, `plow_proofs`) are created automatically by `drizzle-kit push` during the Railway build.

The `plowapp/` folder is the original Claude Design prototype (static HTML, reference only).
