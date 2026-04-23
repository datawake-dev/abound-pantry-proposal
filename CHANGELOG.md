# Changelog — OC Pantry Coordination Network Proposal Site

All notable changes to this project are tracked here. Dates are absolute
(YYYY-MM-DD, Pacific Time).

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
