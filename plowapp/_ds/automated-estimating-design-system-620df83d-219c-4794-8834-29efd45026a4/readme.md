# Automated Estimating — Design System

**Automated Estimating** is construction estimating software backed by BLS (Bureau of Labor Statistics) data, regional pricing, and a full sales-rep system. Contractors and estimators build bids from real labor/material data localized to their region; sales reps track, send, and close those estimates.

**Sources provided:** none (no codebase, Figma, or brand assets were attached). This system was authored from scratch against the company description. **No logo was provided** — the wordmark is rendered in plain type (Archivo Expanded Black, uppercase); never draw a logo mark.

## Direction: "Blueprint & Hi-Vis"
Industrial-utilitarian with fun, poster-like marketing energy. The numbers are the hero — every figure, price, and quantity is set in mono. Ink-navy + warm paper base, safety-orange primary action, blueprint-blue for data/links, hi-vis yellow reserved for the hazard-stripe motif and warnings.

## Content Fundamentals
- **Tone:** confident, plainspoken, a little swagger. Trade-friendly, never corporate-stuffy. Fun in marketing, all-business in the app.
- **Voice:** second person ("Your bid is ready"), product speaks as "we" sparingly. Active verbs.
- **Casing:** Sentence case everywhere in the app (buttons, labels, headings). Marketing headlines UPPERCASE in display type. Small metadata labels UPPERCASE with 0.08em tracking.
- **Numbers:** always mono (`--font-mono`), tabular. Currency with commas, cents only where precision matters ("$48,210" in summaries, "$3.42/sq ft" in line items). Cite the data source: "Backed by BLS Q2 2026 · Region: Denver-Aurora".
- **No emoji.** Ever.
- **Example marketing copy:** "BID IT LIKE YOU MEAN IT." / "Real BLS data. Your region. Your margins." / "Stop guessing. Start winning."
- **Example app copy:** "Estimate sent to client" / "Labor rates updated for Denver-Aurora-Lakewood" / "3 line items need regional pricing".

## Visual Foundations
- **Color:** warm paper surfaces (`--surface-page` #F4F1EA) with ink-navy text; ink-navy (`#0E1B2C`) full-bleed sections for marketing/nav. One accent dominates: safety orange (#FF5C1C) for primary actions only. Blueprint blue for data, links, focus, selection. Yellow ONLY as hazard stripe + warning. Semantic green/red for won/lost, over/under budget.
- **Type:** Archivo variable (width axis). Display = `font-stretch:125%` (Expanded), weight 800–900, uppercase, `--tracking-display`. Body = Archivo 400/500, 15px base, 1.55 leading. All numerals = IBM Plex Mono with `font-variant-numeric:tabular-nums`. Condensed (80%) allowed for big data callouts.
- **Spacing:** 4px base scale (`--space-*`). Controls: 32/40/48px heights. Dense tables (40px rows) in app; generous 96px section padding in marketing.
- **Corners:** sharp. 3px controls, 6px cards, 10px modals. Pill only for badges/tags. Never large soft radii.
- **Borders:** 1px hairline (`--border-default`, warm) for structure; 2px ink rule (`--border-rule`) for emphasis — cards on marketing pages, table header rules, active tab underlines.
- **Shadows:** two systems. Marketing/paper = hard "stamped" offset shadows (`--shadow-stamp`: 5px 5px 0 ink, no blur). App = soft functional (`--shadow-card`, `--shadow-pop`). Never mix on one element.
- **Backgrounds:** flat paper or flat ink. Blueprint grid texture (`--blueprint-grid`, 24px) on hero/empty states. Hazard stripe (`--hazard-stripe`) as thin (6–8px) divider strips and warning banner edges — sparingly, one per view max. No photographic backgrounds, no gradients (the two motif patterns are the only exception).
- **Animation:** snappy and mechanical — `--ease-snap`, 120–200ms. Fades + small translates (4–8px). Hover: buttons darken (`--action-primary-hover`) and stamped elements translate 2px toward their shadow; press: translate the full offset (shadow collapses to 0). No bounces, no parallax.
- **Focus:** always `--focus-ring` (2px white gap + 2px blue). Visible on every interactive element.
- **Transparency/blur:** none. Surfaces are opaque; overlays use rgba(14,27,44,.55) scrim, no backdrop blur.
- **Cards:** app = white, 1px hairline, 6px radius, `--shadow-card`. Marketing = paper-white, 2px ink border, 6px radius, `--shadow-stamp`.
- **Imagery:** none provided. Use blueprint-grid placeholder blocks; if photography is added later it should be warm, natural-light jobsite imagery — never blue-tinted stock.

## Iconography
No icon assets were provided. **Lucide** (CDN) is the designated set — 2px stroke, square joins match the utilitarian direction. Load via `https://unpkg.com/lucide@0.462.0/dist/umd/lucide.min.js` and `<i data-lucide="hammer">` + `lucide.createIcons()`, or copy individual SVGs from `lucide-static`. Keep to 16/20px in UI. No emoji, no unicode glyphs as icons. This is a **flagged substitution** — replace with brand icons if the company has them.

## Intentional additions
No source defined a component inventory, so the standard set below was authored from scratch, sized to an estimating product (e.g. Badge has won/lost/draft statuses).

## Index
- `styles.css` — global entry (imports everything in `tokens/`)
- `tokens/` — colors, typography, spacing, effects, fonts
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/forms/` — Button, IconButton, Input, Select, Checkbox, Radio, Switch
- `components/display/` — Card, Badge, Tag
- `components/navigation/` — Tabs
- `components/feedback/` — Dialog, Toast, Tooltip
- `ui_kits/app/` — estimating app screens (dashboard, estimate detail)
- `ui_kits/website/` — marketing homepage
- `SKILL.md` — agent skill entry point
