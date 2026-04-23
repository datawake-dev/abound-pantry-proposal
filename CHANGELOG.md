# Changelog — OC Pantry Coordination Network Proposal Site

All notable changes to this project are tracked here. Dates are absolute
(YYYY-MM-DD, Pacific Time).

## v0.1.1 — 2026-04-22 — Review pass (strategy → spec → build)

Critical review pass before Victoria's 2026-04-28 review. Walked the
strategy doc → spec → DESIGN.md → built site chain looking for drift,
then applied Codex's parallel code-review findings on top.

### Shipped as real features (buttons that now do what they say)
- **Case-manager cmdk search** filters on user input (was `shouldFilter=false`
  + a fixed `filteredCount = results.length`, so typing did nothing).
  Token-substring match against siteName + neighborhood + reasoning;
  empty query shows all three results. `aria-live` now reflects actual
  visible count.
- **Escape from the case-manager detail panel** collapses back to results
  and returns focus. Previously only worked while focus was inside
  `<Command>`; selecting a result moved focus outside and Escape stopped
  responding.
- **Export CSV** in the data table now actually downloads an RFC-4180 CSV
  of the currently filtered rows. Arrays joined with "; " so embedded
  commas can't split fields.
- **Copy API sample** in Public Infrastructure writes request + response
  JSON to the clipboard with a transient Check-icon confirmation; has a
  textarea fallback for contexts without `navigator.clipboard`.

### Map fixes (broken product argument)
- **Cross-highlight ring** now renders at the highlighted feature's actual
  map position via a MapLibre `dots-highlight` layer filtered by id. Was
  a fixed DOM ring at `left-1/2 top-1/2` — every row hover produced the
  same centered circle. MapLibre auto-reprojects on pan/zoom.
- **`needs-dry-goods` filter** now narrows map dots (was skipped with
  a "kept client-side" comment, so the table narrowed while the map kept
  everything — breaking the shared-filter argument). Pre-computes
  `needsDryGoods` per feature so the MapLibre expression stays simple.
- **Filter toggled before map load** is no longer lost; the load callback
  applies the latest filter set via a ref.
- **"Open today" chip renamed** to "Capacity open" — the filter checks
  `capacityLabel === 'open'`, which is "currently has capacity," not
  "open today." Match the label to the behavior.
- **Keyboard list** now reveals on `focus-within` instead of hiding 20
  `sr-only` focusable buttons. Screen readers still get the list from
  first paint; keyboard users now see it when they tab in.

### Accessibility
- **Axe audit tightened to block on `serious` violations** (was `critical`
  only, which was masking several real issues). Error message now dumps
  selectors + HTML of every offending node.
- **Overlap indicator** (table + map tooltip) now carries `role="img"` so
  `aria-label` is allowed — axe was flagging these as
  `aria-prohibited-attr`.
- **Chat-bubble author bylines** bumped from `text-white/70` on teal
  (~3.25:1 at 10px) to full white + medium weight, past AA.
- **Footer disclaimer + LiveState caption** moved from `--ink-faint`
  (~2.5:1, disabled-state token) to `--ink-muted` (5.22:1, body AA).

### Performance
- **Replaced Motion `whileInView` with a CSS-only `<ScrollReveal>`** +
  one IntersectionObserver per reveal. Drops 9 `<LazyMotion>` trees and
  their Motion observer setup off the client bundle. Sections without
  client-only behavior (Problem, Picture, Coordination, LiveState, Team,
  Scope, CTA, part of SharedDatabase) are now Server Components.
- Current Lighthouse mobile, 4× CPU throttled, against production URL:
  FCP 2.0s · **LCP 3.97s** (down marginally from 3.98s v0.1.0) ·
  Speed Index 2.4s · TBT 131ms · CLS 0.000 · Perf 84.
- Honest read: the LCP bottleneck isn't Motion — it's hydration time on
  4× throttled mobile with opacity-0 reveal elements. Desktop/laptop
  experience (the actual Victoria/Mike surface) renders in ~1s. The
  grant-reviewer audience reads this on a laptop or meeting projector,
  not a 4-year-old phone on 3G. Accepting and documenting.

### Cleanup
- Removed unused `shiki` dep (the API code block uses a hand-tuned
  static token renderer, not Shiki runtime).
- Deleted `_NotReady.tsx` scaffolding placeholder and
  `PublicInfrastructureReveal.tsx` (stale wrapper after Shiki was
  dropped).
- Stripped dead `useState(open)` + sr-only toggle button in the Header.
- Replaced document-title em-dash with a colon (slop-lint bans em-dash
  in rendered copy; the title is rendered).
- Scrubbed two false keyboard hints in SharedDatabase ("Arrow keys
  navigate rows", "S sorts the focused column") — behaviors that don't
  exist in the table implementation.

### Tests / CI
- 322 tests across 24 files still green.
- TypeScript clean, ESLint 0 warnings, Next build succeeds.

## v0.1.0 — 2026-04-22 — Initial deploy

**Live at:** https://abound-pantry-proposal.vercel.app

Single-page Vercel site. Replaces the 2-pager Google Docs as the primary
external artifact for pitching the OC Pantry Coordination Network to
Victoria Torres (A Million Dreams Consulting) and Mike at Abound Food Care.

### What shipped
- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5 + Tailwind CSS v4
- Locked design direction: **Soft Structuralism** (silver-warm paper
  `#F7F6F3`, near-black ink `#0A0A0B`, Datawake teal `#0C7C8A` identity,
  semantic gold `#D4A843` flag). Direction picked after a 5-way side-by-side
  brainstorm review.
- Typography trinity: **Geist** (display), **DM Sans** (body), **Geist Mono**
  (metadata). All loaded via `next/font/google` with `display: swap`.
- Representative data: **20 Anaheim distribution sites** (GeoJSON), **3
  overlap-flagged** on Lincoln Ave East Anaheim (Saturday 9–11 am) so the
  hero product argument "3 pantries, same block, same hour" is honest.
- **Hero with orchestrated reveal** (DESIGN.md §5.5): eyebrow → H1 ("Orange
  County" in teal) → subline → CTAs stagger; gold overlap caption reveals
  at t=1800ms; CSS pulse on cluster runs 3 cycles then stops.
- **Interactive map** on MapLibre GL JS + OpenFreeMap positron tiles with
  hover popup, bidirectional cross-highlight with the DataTable, visually
  hidden keyboard alternative, textual summary.
- **Shared database section** with TanStack Table v8: 8 columns
  (Site/Type/Next/Storage/Model/Capacity/Needs/Overlap), single
  FilterChips surface, aria-sort, cross-hover, side-card FilterSnapshot.
- **Case-manager live cmdk search** with inline detail panel + focus
  management (no modal, focus returns to originating result on collapse).
- **Custom-palette API code block** for the Public Infrastructure section
  (teal keys, gold strings, soft green numbers, muted punctuation) — zero
  client-side runtime cost (static JSX).
- **Scenario tool mock** (Picture section) + **conversational pantry
  exchange** (Coordination section, Karen at St. Mark's) + **Abound console
  mock** (LiveState section).
- **Z-Axis Cascade team cards** with flattened Datawake copy per
  PLAN-REVISIONS scrub table.
- **Floating Fluid Island nav** + minimal footer.

### Accessibility
- WCAG AA contrast validated per DESIGN.md §3.5 via `lib/contrast.ts`
  unit tests (7/7 pairs pass). One token adjustment during the build:
  `--ink-muted` darkened from `#6B7280` (4.47) to `#5F6875` (5.22) and
  `--brand-gold-dark` darkened from `#92710A` (4.32) to `#856708` (5.03)
  to genuinely meet AA — the v2 DESIGN.md rollup had stated numbers that
  the math disagreed with.
- Keyboard-reachable throughout; visually-hidden map feature list for
  keyboard users; row-level tabIndex + focus-visible mirroring hover.
- `prefers-reduced-motion` disables pulse, atmospheric gradient, hero
  orchestration, scroll reveals, and magnetic hovers via `globals.css`.
- Single `<h1>`, heading hierarchy uses only h1 → h2 → h3 (no skipped
  levels). Every `<section>` has `aria-labelledby` pointing at a real id.
- jest-axe default-ruleset page-level audit runs clean (no critical
  violations).

### Performance
- CLS: **0.000** · TBT: **110ms** (both pass DESIGN.md §10.2 thresholds)
- LCP: **3985ms** (Lighthouse mobile, 4× CPU throttled) — currently above
  the 2500ms threshold. Two optimization passes landed: MapLibre dynamic
  import + OpenFreeMap tile-CDN preconnect (LCP 5441 → 3970ms), and Hero
  H1 converted from Motion `initial:opacity:0` to a CSS @keyframes reveal
  that paints opaque at first frame. Desktop LCP is ~1s and the audience
  for this build is a two-person review on desktop/projector — acceptable
  for v0.1. Post-v0.1 backlog: replace Motion `whileInView` in the nine
  below-fold sections with CSS-only scroll reveals + an IntersectionObserver
  trigger; defer the cmdk import.

### Tests
- **322 tests** across **24 files** green at deploy: 7 contrast, 26 slop-lint,
  172 SITE copy, 5 GeoJSON, 12 map filters, 7 MapTooltip, 8 InteractiveMap,
  7 FilterChips, 5 FilterContext, 14 DataTable, 5 SharedDatabase, 7 Hero,
  3 Problem, 4 Picture, 4 Coordination, 3 LiveState, 5 CaseManager, 4
  PublicInfrastructure, 4 Team, 4 Scope, 3 CTA, 4 Header, 2 Footer, 7
  page-level a11y (jest-axe + landmarks + heading hierarchy).
- `tsc --noEmit` clean, ESLint flat config 0 errors/warnings, Next build
  succeeds.

### Stack
- Next.js 16.2.4 (Turbopack)
- React 19.2.4 + React Compiler
- Tailwind CSS v4 (`@theme inline` for semantic tokens)
- shadcn/ui (base-nova preset, Base UI primitives) — Button + Card + Badge +
  Separator + Skeleton only
- MapLibre GL JS 5.23 + OpenFreeMap positron tiles
- TanStack Table v8
- cmdk 1.1
- Motion 12.38 (LazyMotion + `m` components)
- Phosphor Icons (Light weight only)
- Vitest 4.1 + React Testing Library + jest-axe

### Infrastructure
- Repo: https://github.com/datawake-dev/abound-pantry-proposal (public, MIT)
- Vercel team scope: `datawake-vb`
- Domain: `abound-pantry-proposal.vercel.app` (aliased from deployment)
