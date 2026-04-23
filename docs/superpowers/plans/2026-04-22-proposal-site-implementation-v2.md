# OC Pantry Coordination Network Proposal Site — Implementation Plan v2

> **For agentic workers:** REQUIRED SUB-SKILL — `superpowers:subagent-driven-development`. One fresh subagent per task. Two-stage review per task (spec compliance + code quality). Step checkboxes (`- [ ]`) track progress.

**Goal:** Ship a deployed, single-page Vercel site at a preview URL that is the primary external artifact pitching the OC Pantry Coordination Network to Victoria Torres (reviews first) and Mike at Abound Food Care (reviews second). Deadline: Mike's 2026-05-05 09:00 PT call.

**Architecture:** Next.js 16 App Router monolith. One `page.tsx` composes 12 section components (11 content + footer). Representative data is a static GeoJSON file (no database, no auth, no backend). A hero `InteractiveMap` component wraps MapLibre GL JS; a `DataTable` component wraps TanStack Table v8 with a shared `FilterContext` that cross-hovers rows and map dots. Typography is Geist (display) + DM Sans (body) + Geist Mono (metadata). Surface is silver-warm paper `#F7F6F3`, ink near-black `#0A0A0B`, Datawake teal as identity + interactive, gold as semantic flag only.

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript 5.x, Tailwind CSS v4 (@theme inline), shadcn/ui (minimal primitives), MapLibre GL JS + OpenFreeMap, TanStack Table v8, cmdk, Shiki, Motion (LazyMotion + m), Phosphor React (Light weight), Vitest + React Testing Library + jest-axe, ESLint flat config, pnpm, Vercel.

**Source:** `/Users/dustin/projects/clients/prospects/Abound/Proposal/` (local; Drive symlink optional, see Task 6b).

**Upstream contracts:**
- **Spec:** `docs/superpowers/specs/2026-04-22-proposal-site-design.md` (411 lines)
- **Design:** `docs/design/DESIGN.md` v2 (locked direction: Soft Structuralism)
- **Brand:** `/Users/dustin/projects/dw-marketing/brand/brand-guide.md`
- **Revisions tracker:** `docs/superpowers/plans/PLAN-REVISIONS.md` (Codex review v3 findings — all integrated into this v2)

Every section task references `DESIGN.md § N` explicitly. When DESIGN.md and a task disagree, DESIGN.md wins — update the plan, not the design.

---

## What changed from v1 (executive)

**Codex-v3 fixes applied** (per `PLAN-REVISIONS.md`):
- Task 4: `themeColor` moved from `metadata` to `viewport` export (Next.js 16 requirement)
- Task 5 lint script: `"eslint . --max-warnings=0"` (next lint removed)
- Task 7 GeoJSON: keep `.geojson` extension; tests use `fs.readFileSync` + `JSON.parse`; no tsconfig trickery
- Task 9: invert data flow — Server Component reads GeoJSON via `fs.readFileSync` and passes typed prop to client `InteractiveMap`; popup on hover (not click); visually-hidden keyboard-accessible `<ul>` alternative; textual map summary
- Task 22: real WCAG contrast unit tests via `lib/contrast.ts`; never disable axe's `color-contrast` rule
- Copy: scrub unsourced numbers from `lib/site-data.ts` ("tens of millions of pounds" removed, "32 percent" tagged "(representative projection)", "300-plus operators" → "hundreds of operators", "0.6-mile walk" → "a short walk")
- Remove `git checkout app/page.tsx` hack in map visual check; use `app/_preview/map/page.tsx` instead and delete in-step
- Flatter Datawake team card copy ("Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub.")

**Bite-size splits** (Dustin directive: context-clearing chunks):
- Task 1 → 1a (scaffold) + 1b (dependencies)
- Task 9 → 9a (FilterChips) + 9b (MapTooltip) + 9c (InteractiveMap)
- Task 10 → 10a (slop-lint) + 10b (site-data) + 10c (page skeleton)
- Task 25 → 28a (Gmail) + 28b (memory) + 28c (CHANGELOG)

**New tasks:**
- Task 5b — ESLint flat config (Next.js 16 removed `next lint`)
- Task 5c — `robots.ts` + `sitemap.ts`
- Task 6b — Drive symlink (optional, gated, skip if unreachable)
- Task 11 — `FilterContext` + shared filter state primitive
- Task 12 — `DataTable` component (TanStack v8, Double-Bezel, row-to-map cross-hover)
- Task 13 — `SharedDatabase` section (new, post-hero, before Problem — §7.4 in DESIGN.md)
- Task 27b — Lighthouse performance audit on preview (LCP < 2.5s, CLS < 0.1, INP < 200ms, TBT < 300ms)
- Task 27 prereqs — Vercel CLI on PATH, login verified, Datawake team scope captured, preview URL captured to `.vercel-preview-url`

**Direction-specific rewrites:** every section task (14–24) updated to reference the locked Soft Structuralism direction from DESIGN.md v2. Specifically:
- Typography: Geist (display) + DM Sans (body) + Geist Mono (metadata). Drop Instrument Serif.
- Emphasis technique: "Orange County" in teal color, not italic.
- Double-Bezel 1.75rem outer / calc(-6px) inner; stacked 4-layer ambient shadow system.
- Button-in-Button with magnetic hover choreography.
- Floating Fluid Island nav.
- Z-Axis Cascade for team cards.
- Asymmetrical Bento for data section + scope section.
- Subtle teal atmospheric radial gradient per section (hero + data).

**Test ceremony reduction** (Codex):
- Drop per-section exact-string assertions in `tests/components/*.test.tsx`
- Keep: structural anchor (`section#<id>`), landmarks/heading hierarchy, interactive behavior (filter chips, link hrefs, sort toggles), slop-lint at page level
- Rationale: `site-copy-lint.test.ts` already guarantees copy is slop-free site-wide; per-section strings create churn during copy refinement

---

## File structure (target)

```
Proposal/
├── .gitignore                               # includes .superpowers/, .vercel-preview-url, node_modules, .next, .env*.local
├── .prettierrc
├── .prettierignore
├── README.md
├── CHANGELOG.md                             # Task 28c
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs                        # Task 5b, flat config
├── vitest.config.ts
├── vitest.setup.ts
├── components.json                          # shadcn config
├── app/
│   ├── layout.tsx                           # Geist + DM Sans + Geist Mono, metadata, viewport (themeColor)
│   ├── page.tsx                             # single-page assembly
│   ├── globals.css                          # Tailwind v4 @theme inline + Soft Structuralism tokens
│   ├── favicon.ico
│   ├── robots.ts                            # Task 5c
│   ├── sitemap.ts                           # Task 5c
│   └── _preview/
│       └── map/page.tsx                     # Task 9c local-only verification route; DELETED at end of Task 9c
├── components/
│   ├── ui/                                  # shadcn primitives (Button, Card, Badge, Separator, Skeleton)
│   ├── site/
│   │   ├── Header.tsx                       # Floating Fluid Island nav
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── SharedDatabase.tsx               # NEW (Task 13)
│   │   ├── Problem.tsx
│   │   ├── Picture.tsx                      # Strategic Planner (lead narrative)
│   │   ├── Coordination.tsx                 # Conversational pantry loop
│   │   ├── LiveState.tsx                    # Abound console mock
│   │   ├── CaseManager.tsx                  # Live cmdk search
│   │   ├── PublicInfrastructure.tsx         # Shiki API block
│   │   ├── Team.tsx                         # Z-Axis Cascade partner cards
│   │   ├── Scope.tsx
│   │   └── CTA.tsx
│   ├── map/
│   │   ├── InteractiveMap.tsx               # MapLibre; Server Component passes prop
│   │   ├── FilterChips.tsx                  # shared with DataTable via FilterContext
│   │   └── MapTooltip.tsx
│   └── table/
│       ├── DataTable.tsx                    # TanStack v8 + Double-Bezel + cross-hover (Task 12)
│       ├── columns.tsx                      # column defs + cell renderers
│       └── FilterSnapshot.tsx               # side-card summary (bento side)
├── lib/
│   ├── filter-context.tsx                   # FilterContext provider (Task 11)
│   ├── site-data.ts                         # typed copy constants, scrubbed
│   ├── map-data.ts                          # GeoJSON types
│   ├── map-filters.ts                       # filter logic (unit-tested)
│   ├── slop-lint.ts                         # AI-slop word lint
│   ├── contrast.ts                          # WCAG contrast ratio (Task 5)
│   └── utils.ts                             # shadcn cn()
├── public/
│   ├── data/
│   │   └── anaheim-distributions.geojson
│   ├── logos/
│   │   ├── datawake-lockup.png
│   │   └── abound-lockup.svg                # TBD asset; placeholder if absent
│   └── favicon.ico
├── tests/
│   ├── unit/
│   │   ├── map-filters.test.ts
│   │   ├── slop-lint.test.ts
│   │   ├── site-copy-lint.test.ts           # slop-lint over every string in SITE
│   │   ├── contrast.test.ts                 # WCAG pairs from DESIGN.md §3.5
│   │   └── geojson.test.ts                  # Task 7 via fs.readFileSync
│   ├── components/
│   │   ├── FilterChips.test.tsx
│   │   ├── MapTooltip.test.tsx
│   │   ├── InteractiveMap.test.tsx
│   │   ├── DataTable.test.tsx
│   │   ├── Hero.test.tsx
│   │   ├── SharedDatabase.test.tsx
│   │   ├── Problem.test.tsx
│   │   ├── Picture.test.tsx
│   │   ├── Coordination.test.tsx
│   │   ├── LiveState.test.tsx
│   │   ├── CaseManager.test.tsx
│   │   ├── PublicInfrastructure.test.tsx
│   │   ├── Team.test.tsx
│   │   ├── Scope.test.tsx
│   │   └── CTA.test.tsx
│   └── a11y/
│       └── page.a11y.test.tsx
├── .vercel-preview-url                      # gitignored; Task 27 writes, Task 27b + 28a read
├── lighthouse.json                          # gitignored; Task 27b writes
└── docs/
    ├── design/DESIGN.md                     # v2, locked direction
    └── superpowers/
        ├── specs/2026-04-22-proposal-site-design.md
        └── plans/
            ├── 2026-04-22-proposal-site-implementation.md     # v1 (archived reference)
            ├── PLAN-REVISIONS.md
            └── 2026-04-22-proposal-site-implementation-v2.md  # THIS FILE
```

---

# Phase 0 — Contract verification

## Task 0: Verify contracts

**What:** Before a line of code, the executing subagent confirms DESIGN.md v2 exists and is locked, and the spec hasn't drifted.

**Steps:**
- [ ] Read `docs/design/DESIGN.md` — confirm header says `Status: v2 — locked direction (Soft Structuralism)`
- [ ] Read `docs/superpowers/specs/2026-04-22-proposal-site-design.md` §4.3 — the spec lists 10 narrative sections; this plan IMPLEMENTS those 10 AND adds one new section, `SharedDatabase` (spec §7.4 / DESIGN.md §7.4), placed between Hero and Problem. This is an intentional v2 addition, NOT drift. Confirm the 10 spec-listed sections are all represented in this plan's section components.
- [ ] Read `docs/superpowers/plans/PLAN-REVISIONS.md` — confirm every item listed in the "What changed from v1" section above is addressed below
- [ ] If an actual contract has drifted (spec requirement missing from the plan, DESIGN.md direction not reflected, etc.), STOP and surface the drift to Dustin before continuing. The SharedDatabase addition is NOT drift.

**Verification:** brief written check-in; no code changes.

---

# Phase 1 — Foundation

## Task 1a: Scaffold Next.js 16

**Depends on:** Task 0

**Steps:**
- [ ] If `.git` absent: `git init`
- [ ] Set `user.email` / `user.name` per `~/.gitconfig` (inherit; do not overwrite globally)
- [ ] `pnpm create next-app@latest . --typescript --tailwind --app --src-dir=false --eslint --import-alias="@/*"` (accept defaults for the rest; reject telemetry)
- [ ] If interactive flags reject non-empty dir, run with `--force` OR scaffold in a temp dir and move files into place
- [ ] Confirm `pnpm dev` starts on port 3000 and renders the Next.js welcome page
- [ ] Update `.gitignore` to append: `.superpowers/`, `.vercel-preview-url`, `lighthouse.json`, `*.tsbuildinfo`, `.env*.local`

**Verification:**
- `pnpm dev` renders without errors on localhost:3000
- `.gitignore` includes the appended entries
- `git status` shows scaffolded files ready to commit
- Commit: `feat: scaffold Next.js 16 + Tailwind v4 + TypeScript`

## Task 1b: Install runtime + dev dependencies

**Depends on:** Task 1a

**Steps:**
- [ ] Runtime: `pnpm add maplibre-gl @tanstack/react-table cmdk shiki motion @phosphor-icons/react`
- [ ] Dev: `pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom jest-axe @types/jest-axe prettier prettier-plugin-tailwindcss @types/node`
- [ ] Verify `pnpm install` clean (no warnings beyond peer-dep advisories)
- [ ] Note: Motion replaces `framer-motion`; import `{ LazyMotion, m, domAnimation }` from `"motion/react"`
- [ ] Commit: `chore: install runtime + dev dependencies`

**Verification:**
- `pnpm install` exit 0
- `package.json` contains all listed deps with pinned minors
- `node_modules/maplibre-gl` and `node_modules/motion` both present

## Task 2: Install and configure shadcn/ui (minimal set)

**Depends on:** Task 1b

**What:** Only primitives DESIGN.md §6.5 keeps. We drop Dialog, Sheet, Popover, Form, static Table, Tooltip, Select, Tabs, Accordion, Command, Alert.

**Steps:**
- [ ] `pnpm dlx shadcn@latest init` — pick defaults (New York style, neutral palette — we override tokens in Task 3)
- [ ] Add primitives one at a time: `pnpm dlx shadcn@latest add button card badge separator skeleton`
- [ ] Confirm `components.json` reflects New York style + `@/components/ui` alias
- [ ] Update `components/ui/button.tsx` — extend CVA variants per DESIGN.md §6.6: `primary`, `secondary`, `ghost`, `link`. Do NOT ship `variant="default"` raw.
- [ ] Commit: `feat: configure shadcn/ui with Soft Structuralism primitive set`

**Verification:**
- `components/ui/button.tsx` exports the 4 named variants; each renders in a smoke test
- No unused primitives present (Dialog, Sheet, etc. must not be installed)

## Task 3: Configure design tokens in globals.css

**Depends on:** Task 2

**Reference:** DESIGN.md §3 (color system), §2.2 (typography scale), §4 (spatial), §5.2-5.3 (motion)

**Steps:**
- [ ] Rewrite `app/globals.css` with Tailwind v4 structure:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Layer 1 — runtime semantic tokens (DESIGN.md §3.1) */
:root {
  /* Surfaces */
  --surface-paper: #F7F6F3;
  --surface-card: #FFFFFF;
  --surface-ink: #0A0A0B;
  --surface-muted: #F2F1ED;

  /* Brand — Datawake */
  --brand-primary: #0C7C8A;
  --brand-primary-dark: #085A66;
  --brand-primary-light: #E8F5F7;
  --brand-gold: #D4A843;
  --brand-gold-dark: #92710A;
  --brand-gold-light: #FFF8E7;

  /* Ink / neutrals */
  --ink: #0A0A0B;
  --ink-heading-alt: #1C2D3A;
  --ink-muted: #6B7280;
  --ink-faint: #9CA3AF;
  --rule-cool: #E6E5E0;
  --rule-strong: #D7D5CE;

  /* Status (semantic only) */
  --status-open: #10B981;
  --status-partial: #D4A843;
  --status-full: #6B7280;
  --status-closed: #9CA3AF;

  /* Motion */
  --ease-editorial: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 140ms;
  --dur-medium: 260ms;
  --dur-slow: 560ms;
  --dur-hero: 800ms;

  /* Radius */
  --radius-bezel-outer: 1.75rem;  /* 28px */
  --radius-bezel-inner: calc(1.75rem - 0.375rem); /* 22px */

  /* Shadcn bridge */
  --background: var(--surface-paper);
  --foreground: var(--ink);
  --card: var(--surface-card);
  --card-foreground: var(--ink);
  --primary: var(--brand-primary);
  --primary-foreground: #FFFFFF;
  --muted: var(--surface-muted);
  --muted-foreground: var(--ink-muted);
  --border: var(--rule-cool);
  --ring: var(--brand-primary);
  --radius: 0.625rem;
}

/* Layer 2 — expose to Tailwind utilities */
@theme inline {
  --color-surface-paper: var(--surface-paper);
  --color-surface-card: var(--surface-card);
  --color-surface-ink: var(--surface-ink);
  --color-surface-muted: var(--surface-muted);
  --color-brand-primary: var(--brand-primary);
  --color-brand-primary-dark: var(--brand-primary-dark);
  --color-brand-primary-light: var(--brand-primary-light);
  --color-brand-gold: var(--brand-gold);
  --color-brand-gold-dark: var(--brand-gold-dark);
  --color-brand-gold-light: var(--brand-gold-light);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-faint: var(--ink-faint);
  --color-rule-cool: var(--rule-cool);
  --color-rule-strong: var(--rule-strong);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

/* Base */
html, body {
  background: var(--surface-paper);
  color: var(--ink);
  font-family: var(--font-body);
}

/* Utility: tabular nums */
.tabular { font-variant-numeric: tabular-nums; }

/* Atmospheric gradient utility (DESIGN.md §3.3) */
.atmosphere-teal {
  position: absolute;
  top: -120px; right: -80px;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(12, 124, 138, 0.04) 0%,
    transparent 72%
  );
  pointer-events: none;
  z-index: 0;
}

/* Reduced-motion (DESIGN.md §5.1) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .atmosphere-teal { display: none; }
}
```

- [ ] Commit: `feat: configure Soft Structuralism design tokens (Tailwind v4 @theme inline)`

**Verification:**
- `pnpm dev` still starts
- Body bg renders as `#F7F6F3` silver-warm paper in browser
- Class `bg-brand-primary` on a test element renders Datawake teal
- `prefers-reduced-motion: reduce` (toggle via devtools) disables atmospheric gradient

## Task 4: Configure root layout with fonts + viewport + metadata

**Depends on:** Task 3
**Reference:** DESIGN.md §2.1. PLAN-REVISIONS.md Task 4 fix.

**Steps:**
- [ ] Rewrite `app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OC Pantry Coordination Network — Proposal",
  description:
    "Shared food-rescue data for Orange County. Open directory, live distribution state, public APIs. Built with Abound Food Care.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0C7C8A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${dmSans.variable}`}
    >
      <body className="bg-surface-paper text-ink antialiased">{children}</body>
    </html>
  );
}
```

- [ ] Confirm NO `themeColor` in `metadata` (Next.js 16 requirement)
- [ ] Commit: `feat: root layout with Geist + DM Sans + Geist Mono, viewport export`

**Verification:**
- `pnpm build` succeeds (no metadata deprecation warning)
- Browser devtools → font-family computed to Geist on display elements, DM Sans on body
- `<meta name="theme-color" content="#0C7C8A">` appears in rendered HTML

## Task 5: Configure Vitest + React Testing Library + jest-axe + lib/contrast.ts

**Depends on:** Task 1b

**Reference:** PLAN-REVISIONS.md Task 22 fix.

**Steps:**
- [ ] Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] Create `vitest.setup.ts` with `@testing-library/jest-dom` + `jest-axe/extend-expect`
- [ ] Create `lib/contrast.ts` — implement WCAG relative-luminance + contrast ratio:

```ts
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
export function getContrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}
```

- [ ] Create `tests/unit/contrast.test.ts` asserting every pair from DESIGN.md §3.5:

```ts
import { describe, expect, test } from "vitest";
import { getContrastRatio } from "@/lib/contrast";

describe("WCAG contrast pairs from DESIGN.md §3.5", () => {
  test("ink on paper — AAA body", () => {
    expect(getContrastRatio("#0A0A0B", "#F7F6F3")).toBeGreaterThanOrEqual(7);
  });
  test("ink on card — AAA body", () => {
    expect(getContrastRatio("#0A0A0B", "#FFFFFF")).toBeGreaterThanOrEqual(7);
  });
  test("ink-muted on paper — AA body", () => {
    expect(getContrastRatio("#6B7280", "#F7F6F3")).toBeGreaterThanOrEqual(4.5);
  });
  test("brand-primary on paper — AA body", () => {
    expect(getContrastRatio("#0C7C8A", "#F7F6F3")).toBeGreaterThanOrEqual(4.5);
  });
  test("brand-primary on card — AA body", () => {
    expect(getContrastRatio("#0C7C8A", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });
  test("gold-dark on gold-light — AA body", () => {
    expect(getContrastRatio("#92710A", "#FFF8E7")).toBeGreaterThanOrEqual(4.5);
  });
  test("paper on primary-dark — AAA large (CTA band)", () => {
    expect(getContrastRatio("#F7F6F3", "#085A66")).toBeGreaterThanOrEqual(7);
  });
});
```

- [ ] Add `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"lint": "eslint . --max-warnings=0",
"typecheck": "tsc --noEmit"
```

- [ ] Commit: `feat: testing infra (Vitest + RTL + jest-axe + lib/contrast.ts)`

**Verification:**
- `pnpm test` exit 0; contrast suite passes all 7 pairs
- `pnpm typecheck` clean

## Task 5b: ESLint flat config

**Depends on:** Task 1b

**Reference:** PLAN-REVISIONS.md — Next.js 16 removed `next lint`.

**Steps:**
- [ ] `pnpm add -D eslint typescript-eslint eslint-config-next eslint-plugin-react eslint-plugin-react-hooks`
- [ ] Create `eslint.config.mjs` (flat config):

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  next,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
```

- [ ] Confirm `pnpm lint` runs clean on the scaffold
- [ ] Commit: `feat: ESLint flat config for Next.js 16`

**Verification:**
- `pnpm lint` exit 0

## Task 5c: robots.ts + sitemap.ts

**Depends on:** Task 4

**Steps:**
- [ ] Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abound-pantry-proposal.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
```

- [ ] Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abound-pantry-proposal.vercel.app";
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
```

- [ ] Commit: `feat: robots.ts + sitemap.ts for grant-reviewer crawlability`

**Verification:**
- Dev server serves `/robots.txt` and `/sitemap.xml` with expected contents

## Task 6b: Drive symlink (optional, gated)

**Depends on:** Task 1a

**Steps:**
- [ ] Check if `/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/` exists
- [ ] If absent: skip this task with a note in the verification check-in; do NOT block the plan
- [ ] If present: `ln -s /Users/dustin/projects/clients/prospects/Abound/Proposal "/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/Proposal"`
- [ ] Verify `ls` on the symlinked path lists the repo
- [ ] No commit (this is an OS-level operation)

**Verification:**
- Either: symlink present, `ls` resolves; OR task explicitly skipped with reason

---

# Phase 2 — Map data + filter logic + interactive map

## Task 7: Representative Anaheim GeoJSON

**Depends on:** Task 1a
**Reference:** DESIGN.md §8 for the canonical site list. Spec §5.3. PLAN-REVISIONS.md Task 7 fix.

**Steps:**
- [ ] Create `public/data/anaheim-distributions.geojson` with 20 features (the 14 canonical sites from DESIGN.md + 6 additional representative sites to hit the spec's 15-25 count)
- [ ] Each feature: `type: "Feature"`, `geometry: { type: "Point", coordinates: [lng, lat] }`, `properties: { id, name, neighborhood, type, nextDistribution, storage, model, capacityLabel, specificNeeds, isOverlap }`
- [ ] Types in `lib/map-data.ts`:

```ts
export type DistributionType = "pantry" | "frc" | "school" | "mobile" | "appointment";
export type CapacityLabel = "open" | "partial" | "full" | "closed";
export type DistributionModel = "box" | "choice";
export type StorageCapability = "dry" | "cold";

export interface DistributionFeatureProperties {
  id: string;
  name: string;
  neighborhood: string;
  type: DistributionType;
  nextDistribution: string; // "Sat 9–11 am" (representative; parse for sort via nextDistributionIso)
  nextDistributionIso: string; // "2026-04-26T09:00:00-07:00" for sorting
  storage: StorageCapability[];
  model: DistributionModel;
  capacityLabel: CapacityLabel;
  specificNeeds: string[];
  isOverlap: boolean;
}
export type DistributionFeature = GeoJSON.Feature<GeoJSON.Point, DistributionFeatureProperties>;
export type DistributionFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, DistributionFeatureProperties>;
```

- [ ] First 3 sites (First Baptist Lincoln, St. Luke's Lutheran, Community Presbyterian) `isOverlap: true`, tightly clustered on Lincoln Ave East Anaheim around `[-117.88, 33.855]` — verify clustering visually via a quick online GeoJSON viewer
- [ ] Create `tests/unit/geojson.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DistributionFeatureCollection } from "@/lib/map-data";

const fc = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/anaheim-distributions.geojson"), "utf-8"),
) as DistributionFeatureCollection;

describe("Anaheim GeoJSON", () => {
  test("FeatureCollection of Points", () => {
    expect(fc.type).toBe("FeatureCollection");
    expect(fc.features.length).toBeGreaterThanOrEqual(15);
    expect(fc.features.length).toBeLessThanOrEqual(25);
    for (const f of fc.features) expect(f.geometry.type).toBe("Point");
  });
  test("every feature has required properties", () => {
    for (const f of fc.features) {
      const p = f.properties;
      expect(p.id).toMatch(/^\w+$/);
      expect(p.name.length).toBeGreaterThan(3);
      expect(["pantry", "frc", "school", "mobile", "appointment"]).toContain(p.type);
      expect(["open", "partial", "full", "closed"]).toContain(p.capacityLabel);
      expect(["box", "choice"]).toContain(p.model);
      expect(Array.isArray(p.storage)).toBe(true);
      expect(typeof p.isOverlap).toBe("boolean");
    }
  });
  test("exactly 3 overlap-flagged sites in Lincoln cluster", () => {
    const overlaps = fc.features.filter(f => f.properties.isOverlap);
    expect(overlaps.length).toBe(3);
    const [lng0, lat0] = overlaps[0].geometry.coordinates;
    for (const o of overlaps) {
      const [lng, lat] = o.geometry.coordinates;
      expect(Math.abs(lng - lng0)).toBeLessThan(0.005); // ~500m
      expect(Math.abs(lat - lat0)).toBeLessThan(0.005);
    }
  });
  test("within Anaheim bounds", () => {
    for (const f of fc.features) {
      const [lng, lat] = f.geometry.coordinates;
      expect(lng).toBeGreaterThanOrEqual(-118.05);
      expect(lng).toBeLessThanOrEqual(-117.70);
      expect(lat).toBeGreaterThanOrEqual(33.79);
      expect(lat).toBeLessThanOrEqual(33.89);
    }
  });
});
```

- [ ] Confirm `tsconfig.json` does NOT include `"public/**/*.geojson"` (per PLAN-REVISIONS.md)
- [ ] Commit: `feat: representative Anaheim distributions GeoJSON + schema tests`

**Verification:**
- `pnpm test geojson` passes all 4 tests
- Opening the file in an online viewer (e.g., geojson.io) shows 3 points tightly clustered in East Anaheim and the rest distributed across neighborhoods

## Task 8: Map filter logic (TDD)

**Depends on:** Task 7

**Steps:**
- [ ] Write `tests/unit/map-filters.test.ts` FIRST (RED) covering the 5 filters: "Open today", "Cold storage", "Choice market", "Needs dry goods", "Overlap flagged"
- [ ] Each filter returns `(f: DistributionFeature) => boolean`
- [ ] Combining filters is AND (stricter)
- [ ] Tests assert filter output on a fixture of 6 features spanning all types + capabilities
- [ ] Implement `lib/map-filters.ts` until tests pass (GREEN)
- [ ] Types:

```ts
export type FilterKey =
  | "open-today"
  | "cold-storage"
  | "choice-market"
  | "needs-dry-goods"
  | "overlap-flagged";
export interface FilterState {
  active: Set<FilterKey>;
}
export function createEmptyFilterState(): FilterState { return { active: new Set() }; }
export function applyFilters(features: DistributionFeature[], state: FilterState): DistributionFeature[];
export function countActive(state: FilterState): number;
```

- [ ] Commit: `feat: map filter logic (TDD)`

**Verification:**
- `pnpm test map-filters` passes

## Task 9a: FilterChips component

**Depends on:** Task 8
**Reference:** DESIGN.md §6.3 (eyebrow pattern reused as chip visual language), §7.3 (map integration), `high-end-visual-design` §4B for chip micro-interactions.

**Steps:**
- [ ] Create `components/map/FilterChips.tsx`:
  - Props: `{ state: FilterState, onToggle: (k: FilterKey) => void }`
  - Renders a horizontal list with label "FILTER" (Geist Mono 9px uppercase 0.16em tracked) + 5 chip buttons
  - Active chip: teal bg `--brand-primary`, white text, inner highlight shadow; close `X` glyph (Phosphor Light)
  - Inactive chip: white bg, `--ink` text, ring-1 `--rule-cool`, hover border → `--brand-primary`
  - Plain `<button type="button">` toggle with `aria-pressed={active}` — do NOT use `role="switch"` (that role requires `aria-checked`, not `aria-pressed`, and a toggle button is the correct semantic for a filter chip)
  - Transition: `all 200ms var(--ease-editorial)`
- [ ] Test `tests/components/FilterChips.test.tsx`:
  - Renders 5 toggle buttons (no `role="switch"`)
  - Click toggles `aria-pressed` between `"true"` and `"false"`
  - `onToggle` called with correct `FilterKey` arg
  - Active chip renders close `X` icon
- [ ] Commit: `feat(map): FilterChips component`

**Verification:**
- Component test passes
- Visually inspect in Storybook-less preview OR via a temporary `app/_preview/chips/page.tsx` (delete after verify)

## Task 9b: MapTooltip component

**Depends on:** Task 7
**Reference:** DESIGN.md §7.3

**Steps:**
- [ ] Create `components/map/MapTooltip.tsx`:
  - Props: `{ feature: DistributionFeature }`
  - Renders: site name (DM Sans 600 `--ink`), neighborhood (DM Sans 400 `--ink-muted` 11.5px), type badge, next distribution (DM Sans tabular 13px `--ink`), storage badges (Cold/Dry), specific-needs pills (up to 2 + "+N more"), overlap gold-dot flag if `isOverlap`
  - Max width ~280px, rounded `--radius-bezel-inner`, stacked ambient shadow
- [ ] Test `tests/components/MapTooltip.test.tsx`:
  - Renders site name, type label, next distribution, storage badges
  - Conditional overlap flag when `isOverlap === true`
  - Does not render empty `specificNeeds`
- [ ] Commit: `feat(map): MapTooltip component`

**Verification:**
- Component test passes

## Task 9c: InteractiveMap component (MapLibre GL JS)

**Depends on:** Task 9a, 9b, 5
**Reference:** DESIGN.md §7.3, §5.6 (pulse keyframes). PLAN-REVISIONS.md Task 9 fixes (invert data flow, hover, keyboard, textual summary).

**Steps:**
- [ ] Create `components/map/InteractiveMap.tsx` as a CLIENT component (`"use client"`):
  - Props in this task (Task 9c initial shape): `{ features: DistributionFeature[], filterState: FilterState, highlightedId?: string | null, onHighlight?: (id: string | null) => void }` — prop-drilled. Task 14 refactors this to read filter state + highlightedId from `useFilterContext()` instead.
  - On mount: `new maplibregl.Map({ container, style: "https://tiles.openfreemap.org/styles/positron", bounds: [[-118.05, 33.79], [-117.70, 33.89]], maxZoom: 15 })`
  - Add circle layer from features with `data-driven` styling: teal `--brand-primary` default, gold `--brand-gold` when `isOverlap`
  - **Anti-CLS requirement** (DESIGN.md §10.3): the map container wrapper MUST declare `aspect-ratio: 16 / 9` (or an explicit fixed height of 360px matching the design mockup) so MapLibre mounting does not trigger layout shift. This is a BUILD requirement, not a later perf fix.
  - On `mouseenter` feature: show MapLibre `Popup` with rendered `<MapTooltip>` via `ReactDOM.createRoot`; fire `onHighlight(id)` if provided
  - On `mouseleave`: close popup; `onHighlight(null)`
  - **Inbound highlight subscription** (bidirectional cross-hover per DESIGN.md §5.9/§8.3): when `highlightedId` prop is set, add a transient teal ring (SVG overlay or MapLibre layer) around the matching dot. When it clears, remove the ring. This enables table→map highlighting symmetric to the map→table direction.
  - Filter state prop change → update layer filter via `setFilter(layer, toMapLibreFilter(filterState))`
  - SVG overlay on top of map for pulse rings at the overlap cluster center (CSS `ss-pulse-1` + `ss-pulse-2` per DESIGN.md §5.6)
  - **Visually-hidden keyboard alternative:** `<ul>` of focusable `<button>` elements (one per feature), positioned with `sr-only` CSS class; `:focus-visible` within reveals a visible hint tooltip near map. Enter/Space fires same popup state as hover AND sets `highlightedId` via `onHighlight`.
  - **Textual summary paragraph** (visible, below map): "Representative distribution sites in Anaheim. Three sites flagged as overlapping on Saturday 9 am in central Anaheim. Filter by capability below."
  - **Disclaimer:** "Representative demo data. Live coordination layer in development." — small Geist Mono uppercase tracked
- [ ] Ensure no client-side `fetch`. Server component at call site reads GeoJSON via `fs.readFileSync` and passes as prop.
- [ ] Filter chips are NOT composed inside `InteractiveMap` in this task. Task 14 (Hero) composes `<FilterChips>` below the map frame and wires them via `useFilterContext()`. This task exposes the filter-state prop surface; composition is elsewhere.
- [ ] Create ephemeral `app/_preview/map/page.tsx` for visual verification:

```tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DistributionFeatureCollection } from "@/lib/map-data";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { createEmptyFilterState } from "@/lib/map-filters";

const data = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/anaheim-distributions.geojson"), "utf-8"),
) as DistributionFeatureCollection;

export default function Page() {
  return (
    <main className="p-8">
      <InteractiveMap features={data.features} filterState={createEmptyFilterState()} />
    </main>
  );
}
```

- [ ] `pnpm dev` → open http://localhost:3000/_preview/map, verify: map renders, dots visible, gold cluster pulsing, hover shows tooltip, keyboard Tab reaches the visually-hidden list, map container does NOT reflow on MapLibre mount (CLS check — use devtools Performance panel), highlighted-id prop passed via parent renders a visible teal ring on the matching dot
- [ ] **DELETE** `app/_preview/map/page.tsx` at end of this task (do NOT commit the preview route)
- [ ] Test `tests/components/InteractiveMap.test.tsx`:
  - Renders disclaimer + textual summary
  - Renders visually-hidden keyboard list with correct item count
  - Keyboard `Enter` on a focused list item fires `onHighlight` with the feature id
  - `highlightedId` prop rendering an inbound-highlight ring (assert via a `data-highlight-id` attribute on the SVG overlay element)
  - Mock MapLibre import (`vi.mock("maplibre-gl", ...)`) — test the DOM/a11y layer, not the map canvas
- [ ] Commit: `feat(map): InteractiveMap with hover popup, keyboard a11y, textual summary, bidirectional cross-highlight`

**Verification:**
- Component test passes
- Manual browser verify (before preview-route delete): map + pulse + tooltip + keyboard all work
- `app/_preview/map/page.tsx` absent after commit

---

# Phase 3 — Page skeleton + site data + slop lint

## Task 10a: Slop lint

**Depends on:** Task 1b

**Steps:**
- [ ] Create `lib/slop-lint.ts`:

```ts
const BANNED_WORDS: RegExp[] = [
  /\bempower\w*/i,
  /\bleverage[sd]?(?=\s+\w)/i, // verb usage (before another word)
  /\bunlock\w*/i,
  /\btransform\s+your\w*/i,
  /\bseamless\w*/i,
  /\bgame[-\s]?changer\w*/i,
  /\bmove\s+the\s+needle\b/i,
  /\bunleash\w*/i,
  /\bin\s+today'?s\s+fast[-\s]?paced\s+world\b/i,
  /\bsynergy|synergies\b/i,
  /\brevolutioniz\w*/i,
  /\brevolutionary\b/i,
  /\bbest[-\s]?in[-\s]?class\b/i,
  /\bcutting[-\s]?edge\b/i,
  /\bworld[-\s]?class\b/i,
  /\btake\s+(it|this|your)\s+to\s+the\s+next\s+level\b/i,
  /\bproduction[-\s]?grade\b/i,
  /\bnext[-\s]?gen(eration)?\b/i,
];
const EM_DASH_CLAUSE = /\s+—\s+/; // em dash as clause separator with surrounding whitespace
export interface SlopFinding { rule: string; match: string; context: string; }
export function lintSlop(text: string): SlopFinding[] {
  const out: SlopFinding[] = [];
  for (const re of BANNED_WORDS) {
    const m = text.match(re);
    if (m) out.push({ rule: re.source, match: m[0], context: text });
  }
  if (EM_DASH_CLAUSE.test(text)) {
    out.push({ rule: "em-dash-clause", match: "—", context: text });
  }
  return out;
}
```

- [ ] Create `tests/unit/slop-lint.test.ts`:
  - Asserts clean strings pass
  - Asserts every banned word triggers
  - Asserts em dash between words flagged; en dash and hyphen do NOT flag
- [ ] Commit: `feat: slop lint for AI-copy enforcement`

**Verification:**
- `pnpm test slop-lint` passes

## Task 10b: lib/site-data.ts (scrubbed copy)

**Depends on:** Task 10a
**Reference:** PLAN-REVISIONS.md scrub table.

**Steps:**
- [ ] Create `lib/site-data.ts` with typed `SITE` constant containing ALL section copy:
  - `nav` (links + CTA label)
  - `hero` (eyebrow, headline parts, subline parts, CTAs)
  - `sharedDatabase` (eyebrow, H2 parts, body)
  - `problem` (eyebrow, H2, body — "moves food at scale" NOT "tens of millions of pounds")
  - `picture` (eyebrow, H2, body — "32 percent (representative projection)" tagged)
  - `coordination` (eyebrow, H2, body — "hundreds of operators" NOT "300-plus")
  - `liveState` (eyebrow, H2, body, console mock timestamp)
  - `caseManager` (eyebrow, H2, body — "a short walk" NOT "0.6-mile walk"; cmdk pre-populated query)
  - `publicInfrastructure` (eyebrow, H2, body, badge pills, API code block content)
  - `team` (3 partner cards; Datawake flattened: "Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub.")
  - `scope` (eyebrow, H2, 8 scope bullets, 4 timeline rows, budget numbers: "$100–200K build" + "~$100K maintenance over 3 years" + note "Line item inside Abound's grant.")
  - `cta` (eyebrow, H2, body, 2 CTAs)
  - `footer` (credit line, disclaimer)
- [ ] Create `tests/unit/site-copy-lint.test.ts`:

```ts
import { describe, test, expect } from "vitest";
import { SITE } from "@/lib/site-data";
import { lintSlop } from "@/lib/slop-lint";

function walkStrings(obj: unknown, out: string[] = [], path: string[] = []): Array<{ path: string; value: string }> {
  if (typeof obj === "string") return [{ path: path.join("."), value: obj }] as any;
  if (Array.isArray(obj)) return obj.flatMap((v, i) => walkStrings(v, out, [...path, String(i)]));
  if (obj && typeof obj === "object") return Object.entries(obj).flatMap(([k, v]) => walkStrings(v, out, [...path, k]));
  return [];
}

describe("SITE copy passes slop-lint", () => {
  const strings = walkStrings(SITE);
  test.each(strings)("$path is slop-free", ({ path, value }) => {
    const findings = lintSlop(value);
    if (findings.length) {
      throw new Error(`${path}: ${findings.map(f => f.match).join(", ")}\n  "${value}"`);
    }
  });
});
```

- [ ] Commit: `feat: site-data.ts with scrubbed copy + site-wide slop-lint test`

**Verification:**
- `pnpm test site-copy-lint` passes
- Manual audit: every section's key strings match scrub table in PLAN-REVISIONS.md

## Task 10c: Page skeleton

**Depends on:** Task 10b, Task 4

**Note:** Do NOT wire `FilterProvider` here. Task 11 creates the provider AND wires it into this page. Task 10c is provider-free scaffolding.

**Steps:**
- [ ] Rewrite `app/page.tsx` as the single-page assembly with all 12 sections stubbed via a `NotReady` placeholder component:

```tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DistributionFeatureCollection } from "@/lib/map-data";
import Header from "@/components/site/Header";
// ... imports for every section, initially stubbed
// NOTE: FilterProvider is intentionally NOT imported here. Task 11 adds it.

const distributions = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/anaheim-distributions.geojson"), "utf-8"),
) as DistributionFeatureCollection;

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero features={distributions.features} />
        <SharedDatabase features={distributions.features} />
        <Problem />
        <Picture />
        <Coordination />
        <LiveState />
        <CaseManager />
        <PublicInfrastructure />
        <Team />
        <Scope />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] Stub each section component in `components/site/*.tsx` with `return <section id="…"><NotReady name="…" /></section>` placeholder
- [ ] Each section has the correct `id` for nav anchors (`picture`, `coordination`, `scope`, `cta-band`)
- [ ] Props-accepting stubs (Hero, SharedDatabase) accept `features` prop typed as `DistributionFeature[]` even though they don't use it yet
- [ ] Commit: `feat: page skeleton with stubbed section components`

**Verification:**
- `pnpm dev` renders 11 placeholder sections stacked vertically
- Nav anchors scroll to correct sections

---

# Phase 4 — FilterContext + DataTable + SharedDatabase section

## Task 11: FilterContext + shared filter state

**Depends on:** Task 8, 10c
**Reference:** DESIGN.md §8.4

**Steps:**
- [ ] Create `lib/filter-context.tsx` (client component provider):

```tsx
"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { type FilterState, type FilterKey, createEmptyFilterState } from "@/lib/map-filters";

interface FilterContextValue {
  state: FilterState;
  toggle: (k: FilterKey) => void;
  highlightedId: string | null;
  setHighlightedId: (id: string | null) => void;
}
const Ctx = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(createEmptyFilterState);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const toggle = (k: FilterKey) => {
    setState(prev => {
      const next = new Set(prev.active);
      next.has(k) ? next.delete(k) : next.add(k);
      return { active: next };
    });
  };
  return <Ctx.Provider value={{ state, toggle, highlightedId, setHighlightedId }}>{children}</Ctx.Provider>;
}
export function useFilterContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFilterContext must be used inside <FilterProvider>");
  return v;
}
```

- [ ] Wire `FilterProvider` at the root of `app/page.tsx` by wrapping the existing `<><Header /><main>...</main><Footer /></>` in `<FilterProvider>...</FilterProvider>`. This is the ONLY place the provider is mounted site-wide. Do NOT add a second provider in Task 25's a11y test wrapper — the test imports `<Page>` which already has the provider.
- [ ] Test `tests/components/filter-context.test.tsx`: toggle semantics, highlight state get/set, provider throws meaningful error when `useFilterContext` called outside `<FilterProvider>`
- [ ] Commit: `feat: FilterContext for shared map/table filter + highlight state; wire into page.tsx root`

**Verification:**
- Test passes
- `InteractiveMap` from Task 9c can be refactored to use `useFilterContext()` instead of prop drilling (do this refactor in Task 14 when Hero composes the map)

## Task 12: DataTable component (TanStack Table v8)

**Depends on:** Task 11, Task 7
**Reference:** DESIGN.md §7.4, §8 (deep-spec)

**Steps:**
- [ ] Create `components/table/columns.tsx` with 8 `ColumnDef<DistributionFeatureProperties>` entries matching DESIGN.md §8.2:
  - Site (220px sortable; composite cell — name Geist 500 ink, neighborhood DM Sans 400 muted 11.5px)
  - Type (120px filterable; Badge, 5 type variants)
  - Next (140px sortable; DM Sans tabular; sorts by `nextDistributionIso`)
  - Storage (120px; stacked cold/dry badges, Phosphor Snowflake + Package)
  - Model (110px; box/choice badge)
  - Capacity (120px sortable; capacity pill with status dot)
  - Needs (180px; pill list, up to 2 + "+N more")
  - Overlap (48px sortable; gold dot if `isOverlap`, empty else; sorts overlap rows first)
- [ ] Create `components/table/DataTable.tsx`:
  - Wrapped in Double-Bezel per DESIGN.md §6.1
  - `useReactTable({ data, columns, getCoreRowModel, getSortedRowModel, getFilteredRowModel })`
  - Consumes `useFilterContext()` for filter state → `getFilteredRowModel` applies
  - Row `onMouseEnter`: `setHighlightedId(row.original.id)`; `onMouseLeave`: `setHighlightedId(null)`
  - Row `:focus-visible` mirror — same highlight on keyboard focus
  - Column header: Geist Mono 9.5px 0.14em uppercase `--ink-muted`, sort caret (Phosphor Light) rotates on sort change
  - Row hover bg `rgba(12,124,138,0.04)` 160ms
  - Overlap rows: 4px left border `--brand-gold` + subtle gold-tint bg `rgba(212,168,67,0.04)`
  - Max height 460px with internal scroll; header sticky within
  - Footer row: "N of 20 sites · Filtered: [count]" + "Export CSV" ghost button (mock, non-functional in v1)
  - `aria-sort` on sortable columns; `aria-live="polite"` announcer for "N sites. Filtered to X."
- [ ] Create `components/table/FilterSnapshot.tsx`:
  - Compact side-card, Double-Bezel
  - **Data contract (non-negotiable):** all displayed metrics reflect the CURRENT FILTERED ROW SET — not the full 20-row population. When no filters are active, the filtered set equals all 20. When filters narrow the set, metrics update accordingly. "N sites match" shows filtered count (e.g., "14 of 20" when 6 filtered out). Capacity bars count filtered rows by `capacityLabel`. Source: `useReactTable().getFilteredRowModel().rows` passed as a prop from the parent `DataTable`, not a separate hook call.
  - Contents: "Filter state" Geist Mono label + active chips list (mirrors FilterContext `state.active`) + "N of 20 sites match" big number in Geist Display S teal + "Capacity distribution" micro-bar chart (4 stacked horizontal bars for Open/Partial/Full/Closed counts over filtered rows, tabular-nums)
- [ ] Test `tests/components/DataTable.test.tsx`:
  - Renders 8 columns, 20 rows
  - Column click toggles `aria-sort` between `"none"` / `"ascending"` / `"descending"`
  - Filter context change hides filtered rows (tested via `<FilterProvider>` wrapper)
  - Row `onMouseEnter` sets `highlightedId` (spy on context `setHighlightedId`)
  - Row `onMouseLeave` clears `highlightedId`
  - Row `:focus-visible` also sets `highlightedId` (keyboard parity — use `userEvent.tab()` to drive focus)
  - Row has `tabIndex={0}` so keyboard-only users reach it
  - `aria-live="polite"` region present and content updates on filter change
  - FilterSnapshot receives and renders filtered row count correctly (test via prop spy OR by asserting the DOM's "N of 20" text after a filter toggle)
- [ ] Commit: `feat(table): TanStack DataTable with bidirectional cross-hover + FilterSnapshot side card`

**Verification:**
- Component tests pass
- Manual browser verify (when composed in Task 13): hover row → row bg shifts teal-tint; no console errors

## Task 13: SharedDatabase section

**Depends on:** Task 12
**Reference:** DESIGN.md §7.4

**Steps:**
- [ ] Rewrite `components/site/SharedDatabase.tsx`:
  - `<section id="shared-database">`
  - Atmospheric gradient (§3.3) absolutely positioned
  - Section eyebrow tag: "The shared database"
  - H2 Display L: "Every distribution, every week. One source of truth." ("One source" in `--brand-primary`)
  - Body L (max 58ch): per SITE.sharedDatabase
  - Filter chips row (above table, shared FilterContext)
  - Asymmetric Bento `grid-cols-[1fr_280px]` lg+, 1fr mobile:
    - Main: `<DataTable>` composed with GeoJSON features
    - Side: `<FilterSnapshot>` (hidden below lg)
  - Below table: micro strip of 3 interaction hints (Geist Mono 10px): "Hover row to highlight map dot · ↑↓ Arrow navigate · S sort column"
- [ ] Test `tests/components/SharedDatabase.test.tsx`:
  - `section#shared-database` present
  - Eyebrow + H2 + body render
  - Filter chips render (5 chips)
  - DataTable renders 20 rows
  - FilterSnapshot side-card renders at lg+ (JSDOM can't size; assert presence only)
- [ ] Commit: `feat(site): SharedDatabase section composing table + filter chips + snapshot`

**Verification:**
- Component test passes
- `pnpm dev` → manually scroll below hero, verify section renders at quality level

---

# Phase 5 — Hero + Section components

## Phase 5 preamble — required for every section task (15–24)

Every section component in Tasks 15–24 MUST apply the scroll-reveal treatment from DESIGN.md §5.7. The Hero (Task 14) uses the richer orchestrated reveal from §5.5 instead; every other section uses the standard `whileInView` pattern:

```tsx
<LazyMotion features={domAnimation}>
  <m.div
    initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
  >
    {/* eyebrow + H2 + first body paragraph + major data block */}
  </m.div>
</LazyMotion>
```

Apply to: eyebrow, H2, first body paragraph, and the section's major data block (mock, card, table). NOT every paragraph (over-animated). Reduced-motion disables via the global CSS in `globals.css` (Task 3) — no per-component branch needed.

Do not repeat this reveal spec in every task; cite "Phase 5 preamble scroll reveal" in each task step.

## Task 14: Hero section

**Depends on:** Task 9c, Task 11
**Reference:** DESIGN.md §7.2, §5.5 (orchestration), §6.2 (Button-in-Button)

**Steps:**
- [ ] **Refactor `InteractiveMap` (from Task 9c) to read filter state + highlightedId from `useFilterContext()`** instead of props. Keep `features` as a server-passed prop. Remove `filterState`, `highlightedId`, and `onHighlight` from the component's prop surface; those become context reads + writes internally. Update the (single) InteractiveMap unit test to wrap the component in `<FilterProvider>`. This refactor lives inside Task 14.
- [ ] Rewrite `components/site/Hero.tsx` as a client component:
  - Editorial Split layout `grid-cols-1` mobile → `grid-cols-[minmax(0,480px)_minmax(0,1fr)]` md+, gap 64px
  - Left column: eyebrow tag · H1 Display XL (with `<span className="text-brand-primary">Orange County</span>`) · subline · Primary + Secondary Button-in-Button CTAs
  - Right column: InteractiveMap in Double-Bezel. Wrap in a container with explicit `aspect-ratio: 16 / 9` (or fixed height 360px matching design) to prevent CLS when MapLibre mounts. **Do NOT compose `<FilterChips>` here** — per DESIGN.md §8.4, the chips component exists ONCE, rendered in the SharedDatabase section (Task 13) at the boundary between hero's map and the data table. Because map and table both read from `FilterContext`, the single chip surface controls both. Hero's map reacts to chip toggles without hosting the chip UI itself.
  - Atmospheric teal gradient `::before` (§3.3)
  - Orchestrated reveal via Motion:
    ```tsx
    <LazyMotion features={domAnimation}>
      <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.56, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}>
        {/* eyebrow */}
      </m.div>
      {/* ...staggered per DESIGN.md §5.5 timeline... */}
    </LazyMotion>
    ```
  - Gold overlap caption reveals at t=1800ms with both the `[SAT 9:00AM · 3 PANTRIES · 300 M]` gold-flag pill AND the body sentence "The system cannot see this." The `300 M` metric is labeled as representative inline — either via a tiny Geist Mono `(representative)` tag beneath the pill OR by its inclusion in the "Representative demo data" disclaimer line below the map (acceptable either way; pick one and execute).
- [ ] Test `tests/components/Hero.test.tsx`:
  - `section` with single `<h1>` renders
  - H1 text contains `"Orange County"` (presence-based, NOT exact-equality per the test-ceremony-reduction rule; the authoritative copy check is `tests/unit/site-copy-lint.test.ts`)
  - Primary + Secondary CTAs render with correct `href` (`#shared-database` / `#coordination`)
  - `<FilterChips>` is NOT rendered inside Hero (presence-absent check; the single chip surface lives in SharedDatabase per DESIGN.md §8.4)
  - Skip per-motion-frame assertions; test "eventually-rendered" state via `await findBy…`
- [ ] Commit: `feat(site): Hero with orchestrated reveal + Button-in-Button + embedded map + context refactor`

**Verification:**
- Component test passes
- Manual browser: reveal plays; pulse completes 3 cycles then stops; gold caption visible; reduced-motion disables motion

## Task 15: Problem section

**Depends on:** Task 14
**Reference:** DESIGN.md §7.5

**Steps:**
- [ ] Rewrite `components/site/Problem.tsx`:
  - Single-column editorial `max-w-[680px]` centered, `bg-surface-muted`
  - Eyebrow "The problem"
  - H2: "A food-rescue system that cannot see itself."
  - Body (80–150 words): per SITE.problem (no em dash clause separators, no unsourced numbers)
  - Distinctive element: inline map cutout (right-floated desktop via `float-right`, full-width centered mobile) — ~220x160px Double-Bezel, showing Lincoln Ave cluster zoomed tighter than hero, gold dots visible. Implement as SVG cutout using the same coordinate projection as the hero map, NOT a second MapLibre instance (bundle size). Static.
- [ ] Test `tests/components/Problem.test.tsx`:
  - `section#problem` with `<h2>`
  - Heading hierarchy OK
  - Inline cutout SVG renders with `role="img"` and accessible name
- [ ] Commit: `feat(site): Problem section with inline Lincoln Ave cutout`

**Verification:**
- Component test passes

## Task 16: Picture section (Strategic Planner — LEAD narrative)

**Depends on:** Task 14
**Reference:** DESIGN.md §7.6

**Steps:**
- [ ] Rewrite `components/site/Picture.tsx`:
  - Asymmetric split `grid-cols-[minmax(0,520px)_minmax(0,1fr)]` md+
  - Eyebrow "The picture"
  - H2: "One shared picture, used by coalition leaders."
  - Body (150–250 words, max 58ch) per SITE.picture — includes "(representative projection)" tag
  - Right column: scenario tool mock in Double-Bezel with header "Scenario · Consolidation preview" (Geist Mono tag), 3 pantry checkboxes with storage badges, proposed consolidation radio, metric gauges (3 horizontal bars with "representative" labels), ghost "Compare before/after" button, footer disclaimer
  - All checkboxes/radios styled in our token system (not raw shadcn defaults); use `<input type="checkbox">` styled with peer utilities
- [ ] Test `tests/components/Picture.test.tsx`:
  - `section#picture`
  - Scenario tool renders 3 pantry checkboxes
  - "(representative projection)" label present
- [ ] Commit: `feat(site): Picture section with scenario tool mock (lead narrative)`

**Verification:**
- Component test passes

## Task 17: Coordination section

**Depends on:** Task 14
**Reference:** DESIGN.md §7.7

**Steps:**
- [ ] Rewrite `components/site/Coordination.tsx`:
  - `grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]` md+
  - Eyebrow "Coordination without a login"
  - H2: "Pantries stay in their inbox."
  - Body (100–150 words) per SITE.coordination — "hundreds of operators"
  - Right column: text message exchange in Double-Bezel styled as phone screen (portrait aspect desktop)
    - "Sample exchange · representative" Geist Mono tag label
    - 4 chat bubbles: system neutral left, Karen teal right, system confirmation neutral left, mid-week supply-routing neutral left
    - Bubbles: Datawake teal for operator, white with `--rule-cool` border for system; radius 14px, max-width 85%
    - Names visible: "Karen at St. Mark's" attribution
- [ ] Test `tests/components/Coordination.test.tsx`:
  - `section#coordination`
  - 4 chat bubbles render
  - "representative" label present
- [ ] Commit: `feat(site): Coordination section with text exchange visual`

**Verification:**
- Component test passes

## Task 18: LiveState section

**Depends on:** Task 14
**Reference:** DESIGN.md §7.8

**Steps:**
- [ ] Rewrite `components/site/LiveState.tsx`:
  - Single column `max-w-[1100px]`
  - Eyebrow "The live state"
  - H2: "Abound opens one console every morning."
  - Body per SITE.liveState
  - Console mock in Double-Bezel:
    - Window chrome top bar: 3 muted dots (use `--ink-faint`, `--rule-cool`, `--rule-cool` — NOT red/yellow/green), mono timestamp "Tue Apr 28 · 7:42 am PT"
    - 3-column grid inside: Supply Pipeline (teal-accent), Distribution Calendar (neutral), Routing Queue (gold-accent for AI-flagged)
    - Each column: mono eyebrow header + ~3 representative list items
    - Row hover matches data table (teal-tint bg)
  - Caption below window: "Representative layout. Real console lives in the Abound account post-deploy."
- [ ] Test `tests/components/LiveState.test.tsx`:
  - `section#live-state`
  - 3 column headers render
  - Representative caption present
- [ ] Commit: `feat(site): LiveState section with Abound console mock`

**Verification:**
- Component test passes

## Task 19: CaseManager section (LIVE cmdk)

**Depends on:** Task 14, cmdk dep
**Reference:** DESIGN.md §7.9

**Steps:**
- [ ] Rewrite `components/site/CaseManager.tsx`:
  - `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` md+
  - Eyebrow "A door for every family"
  - H2: "A case manager finds the right pantry in under a minute."
  - Body per SITE.caseManager — "a short walk" NOT unsourced distance
  - Right column: LIVE cmdk command palette in Double-Bezel (NOT a static screenshot):
    - Pre-populated input: "walkable 92804 open today spanish-speaking no appointment kid friendly"
    - 3 result items with plain-English reasoning (representative data inline)
    - Enter/click opens a representative detail panel within the Double-Bezel (inline expansion, not a modal)
    - Keyboard: arrow keys cycle results (cmdk-native)
    - `aria-live="polite"` announces result count on filter
    - **Focus management (DESIGN.md §11):** when the detail panel expands, focus moves to the panel's heading (or first focusable element within). When the panel collapses, focus returns to the result item that triggered it. Use a `ref` on the trigger button + `useEffect` to `.focus()` on the correct element in both directions. Because the panel is inline (not a modal), do NOT trap focus — but the return-to-trigger behavior is required.
  - Fallback: if cmdk fails to load (e.g., JS disabled), render static mock of same visual
  - Apply Phase 5 preamble scroll reveal to the eyebrow + H2 + body block
- [ ] Test `tests/components/CaseManager.test.tsx`:
  - `section#case-manager`
  - cmdk input renders with pre-populated value
  - 3 default result items present
  - Arrow-key navigation cycles (user-event + keyboard)
  - Enter on a result moves focus to the detail panel heading; Escape or collapse trigger returns focus to the originating result item (assert via `document.activeElement`)
- [ ] Commit: `feat(site): CaseManager with live cmdk command palette + focus management`

**Verification:**
- Component test passes
- Manual browser: type → results filter; arrow keys cycle; screen reader announces result count

## Task 20: PublicInfrastructure section (Shiki)

**Depends on:** Task 14, Shiki dep
**Reference:** DESIGN.md §7.10

**Steps:**
- [ ] Rewrite `components/site/PublicInfrastructure.tsx`:
  - `grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]` md+
  - Eyebrow "Public infrastructure"
  - H2: "Open source. Public APIs. Any county can fork it."
  - Body per SITE.publicInfrastructure
  - Badge pills below body: "GitHub · OpenAPI · MIT or Apache 2.0 · Any county can fork" — Geist Mono labels on `--surface-muted` pills
  - Right column: Shiki-highlighted API code block in Double-Bezel with `--surface-ink` (deep near-black) inner core
    - Custom Shiki theme (JSON fixture): teal for keys, gold for flags, muted ink faint for brackets/punctuation, white-on-ink for values
    - Content: GET request + JSON response with representative distribution schema
    - "Copy" button top-right (Phosphor Light Copy icon inside a mini Button-in-Button wrapper)
  - Shiki lazy-loaded via `dynamic(() => import("./ShikiBlock"))` to keep hero LCP clean
- [ ] Test `tests/components/PublicInfrastructure.test.tsx`:
  - `section#public-infrastructure`
  - 4 badge pills render
  - Shiki block renders (mock the dynamic import)
- [ ] Commit: `feat(site): PublicInfrastructure with Shiki API block`

**Verification:**
- Component test passes
- Manual browser: code block renders with custom theme colors; Copy button places text on clipboard

## Task 21: Team section (Z-Axis Cascade)

**Depends on:** Task 14
**Reference:** DESIGN.md §7.11. PLAN-REVISIONS.md Datawake team card flatten.

**Steps:**
- [ ] Rewrite `components/site/Team.tsx`:
  - Asymmetrical Bento with Z-Axis Cascade: `grid-cols-1` mobile → `grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]` lg+ with cards rotated `-1.5deg`, `+1deg`, `-0.5deg` and subtle negative-margin overlap (max 16px). Rotations and overlaps removed below `md` (768px) per `high-end-visual-design` §3B.
  - Eyebrow "Who is building this"
  - H2: "Three partners, three specific roles."
  - 3 cards, each Double-Bezel:
    - Abound Food Care — product owner / grant applicant / long-term operator. Logo placeholder: 48x48 gold-tint square with initials "AFC" (TBD asset placeholder, styled as intentional, not generic)
    - A Million Dreams Consulting (Victoria Torres) — co-PM / domain expert / adoption lead. Placeholder with initials "AMDC"
    - Datawake — builder / maintainer. Card body EXACTLY: **"Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub."** No stack list. No "production-grade." No "cutting-edge."
- [ ] Test `tests/components/Team.test.tsx`:
  - `section#team`
  - 3 partner cards render with correct headings
  - Datawake card copy matches the flattened string exactly
  - "production-grade" absent
- [ ] Commit: `feat(site): Team section with Z-Axis Cascade + flattened Datawake copy`

**Verification:**
- Component test passes
- Manual browser: subtle card rotation visible desktop, collapsed flat mobile

## Task 22: Scope section

**Depends on:** Task 14
**Reference:** DESIGN.md §7.12

**Steps:**
- [ ] Rewrite `components/site/Scope.tsx`:
  - Asymmetrical Bento: `grid-cols-1` mobile → `grid-cols-[minmax(0,8fr)_minmax(0,4fr)]` lg+
  - Left (8 col): scope bullet list, each item a 2px left-border-teal indicator + Geist label + DM Sans body. 8 scope bullets per SITE.scope.bullets.
  - Right top (4 col): timeline dl/dt/dd — 4 rows (Start, MVP at 3 months, Full V1, Ongoing). DM Sans.
  - Right bottom (4 col): budget block in Double-Bezel
    - "$100–200K build" in Geist Display S (teal `--brand-primary`)
    - "~$100K maintenance over 3 years" in Geist Display S (teal)
    - Small Geist Mono caption: "Line item inside Abound's grant."
- [ ] Test `tests/components/Scope.test.tsx`:
  - `section#scope`
  - 8 scope items render
  - 4 timeline rows render
  - Budget numbers render in `font-sans` (Geist, which is our `font-sans`)
- [ ] Commit: `feat(site): Scope section with Display-S budget numbers`

**Verification:**
- Component test passes
- Visual: budget numbers clearly larger/tighter than body; feels editorial not spreadsheet-y

## Task 23: CTA band

**Depends on:** Task 14
**Reference:** DESIGN.md §7.13

**Steps:**
- [ ] Rewrite `components/site/CTA.tsx`:
  - `<section id="cta-band">` full-bleed, `bg-brand-primary-dark` with subtle radial gradient (teal → slightly-darker teal toward corners), text reversed to `--surface-paper`
  - Eyebrow "Next steps" in `--brand-gold-light/70` or similar
  - H2 on dark: "Let us build this together."
  - Body (centered, max 52ch): per SITE.cta
  - Two CTAs:
    - Primary (gold pill — documented exception on deep-teal surface): `bg-brand-gold`, ink text `--ink`, Button-in-Button arrow
    - Secondary (outlined white): `border-white/30`, white text
  - Stacked ambient shadow still applies to the CTA buttons
- [ ] Test `tests/components/CTA.test.tsx`:
  - `section#cta-band`
  - 2 CTAs render with correct `href` (mailto: for email, calendar link for call)
- [ ] Commit: `feat(site): CTA band with gold-on-teal exception (documented)`

**Verification:**
- Component test passes
- Manual browser: deep teal section, gold primary CTA visibly the anchor

## Task 24: Header (Floating Fluid Island) + Footer

**Depends on:** Task 14, Task 23
**Reference:** DESIGN.md §6.4 (nav), §7.14 (footer)

**Steps:**
- [ ] Rewrite `components/site/Header.tsx`:
  - Floating Fluid Island: `mt-6 mx-auto w-max max-w-[92%] rounded-full backdrop-blur-xl bg-white/78 ring-1 ring-[rgba(10,10,11,0.07)]`
  - Contents: Datawake mark (20px rounded-6 teal→dark-teal gradient square) + "OC Pantry Coordination" wordmark (Geist 600 13px) + vertical rule + "PROPOSAL" tag (Geist Mono 9px uppercase tracked 0.16em) + anchor links ("The picture" #picture, "How it works" #coordination, "Scope" #scope) + mini Button-in-Button "Contact" CTA (ink-black bg, white text, 22px icon wrapper, links to #cta-band)
  - Stacked shadow: inset 0 1px 0 white/90, 0 2px 4px ink/04, 0 8px 24px -8px ink/08
  - Below 860px: anchor links hide; brand + CTA only
  - No scroll-based shadow deepening (Apple-pro rule per DESIGN.md §6.4)
- [ ] Rewrite `components/site/Footer.tsx`:
  - Single line desktop, stacked mobile, `bg-surface-muted` with hairline top border
  - "Built with Abound Food Care by Datawake. © 2026." + representative-data disclaimer + Datawake 20px mark bottom-right
- [ ] Test `tests/components/Header.test.tsx`:
  - Nav renders with 3 anchor links pointing to `#picture`, `#coordination`, `#scope`
  - Contact CTA points to `#cta-band`
  - "PROPOSAL" label present
- [ ] Test `tests/components/Footer.test.tsx`:
  - Footer renders with credit + disclaimer
- [ ] Commit: `feat(site): Header (Floating Fluid Island) + Footer`

**Verification:**
- Component tests pass
- Manual browser: nav floats detached from top, anchor clicks scroll, mobile collapses cleanly

---

# Phase 6 — Audit + Deploy

## Task 25: Page-level accessibility audit

**Depends on:** Task 13 + Tasks 14–24 (SharedDatabase and all sections must be fully implemented, not stubbed)
**Reference:** DESIGN.md §11. PLAN-REVISIONS.md Task 22 fix (DO NOT disable color-contrast).

**Pre-check:**
- [ ] Open `app/page.tsx` and verify every section component is imported from the real implementation, not the `NotReady` stub. If any section still renders `<NotReady>`, STOP and complete that task first.

**Steps:**
- [ ] Create `tests/a11y/page.a11y.test.tsx`:
  - Renders full `<Page>` directly (NOT re-wrapped in `<FilterProvider>` — Page already includes it per Task 11)
  - Runs jest-axe against the DOM with DEFAULT rules (do NOT disable `color-contrast`)
  - Additional assertions:
    - exactly one `<h1>` (in Hero)
    - heading hierarchy: no skipped levels
    - one `<header>`, one `<main>`, one `<footer>`
    - every `<section>` has `aria-labelledby` pointing to its heading
    - `FilterChips` present exactly once in the DOM (rendered in SharedDatabase per DESIGN.md §8.4; the single chip surface controls both map and table via FilterContext)
- [ ] If axe's color-contrast rule produces false positives under jsdom (CSS variables unresolved), add a comment citing the issue and keep the assertion — rely on `tests/unit/contrast.test.ts` for the authoritative contrast coverage
- [ ] Commit: `test(a11y): page-level axe audit + landmarks`

**Verification:**
- `pnpm test a11y` passes with default axe rules

## Task 26: Full test run + production build

**Depends on:** Task 25, Task 13, Tasks 14–24 (all section components implemented)

**Pre-check:**
- [ ] `grep -r "NotReady" components/site/` → must return zero matches. Any `NotReady` stub means an implementation task is incomplete; do not proceed.

**Steps:**
- [ ] `pnpm typecheck` — exit 0
- [ ] `pnpm lint` — exit 0
- [ ] `pnpm test` — all suites green (unit, component, a11y)
- [ ] `pnpm build` — Next.js production build succeeds
- [ ] `pnpm start` — serves production build on :3000; smoke-test manually:
  - Hero loads, orchestrated reveal plays, pulse 3 cycles then stops
  - Map renders with teal dots + gold overlap cluster
  - Hero filter chips toggle → SharedDatabase table rows filter (and vice versa)
  - Table row hover → matching map dot gets teal ring
  - cmdk in CaseManager responds to typing + arrow keys; Enter focuses detail panel; Escape returns focus
  - Keyboard-only Tab flow reaches every interactive element, including the visually-hidden map feature list
  - Reduced-motion toggle disables pulse + scroll reveals
- [ ] Commit with notes: `chore: full audit green — ready for Vercel`

**Verification:**
- All four commands exit 0
- Manual smoke passes every checklist item above

## Task 27: Deploy to Vercel

**Depends on:** Task 26

**Prerequisites** (Codex fix — verify BEFORE attempting):
- [ ] `which vercel` — if absent, `pnpm add -g vercel`
- [ ] `vercel whoami` — if fails, prompt Dustin to run `vercel login` in a separate terminal; block until resolved
- [ ] Capture Datawake team scope: `vercel teams ls` and note the scope id/slug for Datawake; use `--scope <id>` on subsequent commands if multiple teams present

**Steps:**
- [ ] `vercel link --yes --project abound-pantry-proposal [--scope <datawake-scope>]` — creates new project or links existing
- [ ] `vercel env add NEXT_PUBLIC_SITE_URL production` (optional; defaults to preview URL)
- [ ] `vercel --prod=false` for preview deploy (grant review happens on preview URL; production promotion is a separate decision)
- [ ] Capture preview URL from `vercel` output: write to `.vercel-preview-url` (gitignored)
- [ ] Commit: `chore: linked to Vercel project abound-pantry-proposal`

**Verification:**
- `.vercel-preview-url` exists with an `https://...vercel.app` URL
- Browser loads the URL; hero + data table render; map + pulse work

## Task 27b: Lighthouse performance audit on preview

**Depends on:** Task 27
**Reference:** PLAN-REVISIONS.md Task 23b (new). Spec §4.1: "work in under 3 seconds on a typical mobile connection."

**Steps:**
- [ ] Read preview URL from `.vercel-preview-url`
- [ ] `pnpm dlx lighthouse "$(cat .vercel-preview-url)" --preset=perf --form-factor=mobile --throttling.cpuSlowdownMultiplier=4 --output=json --output-path=./lighthouse.json --quiet --chrome-flags="--headless=new"`
- [ ] Create `scripts/check-lighthouse.mjs` — deterministic Node parser (no `jq` dependency required on macOS / Linux / CI):

```js
#!/usr/bin/env node
import { readFileSync } from "node:fs";
const report = JSON.parse(readFileSync("./lighthouse.json", "utf-8"));
const audits = report.audits;
const lcp = audits["largest-contentful-paint"].numericValue;
const cls = audits["cumulative-layout-shift"].numericValue;
const tbt = audits["total-blocking-time"].numericValue;
// INP is not always reported in lab-mode; fall back to TBT as proxy
const inp = audits["interactive"]?.numericValue ?? tbt;

const thresholds = { lcp: 2500, cls: 0.05, tbt: 300 };
const results = [
  ["LCP", lcp, thresholds.lcp, "ms"],
  ["CLS", cls, thresholds.cls, ""],
  ["TBT", tbt, thresholds.tbt, "ms"],
];
let failed = 0;
for (const [metric, value, threshold, unit] of results) {
  const pass = value < threshold;
  if (!pass) failed++;
  console.log(`${pass ? "PASS" : "FAIL"} ${metric}: ${value.toFixed(metric === "CLS" ? 3 : 0)}${unit} (threshold ${threshold}${unit})`);
}
process.exit(failed ? 1 : 0);
```

- [ ] Run `node scripts/check-lighthouse.mjs` — exit 0 means all thresholds pass. Add `package.json` script: `"perf:check": "node scripts/check-lighthouse.mjs"`.
- [ ] Thresholds (match DESIGN.md §10.2 exactly — do not relax):
  - LCP < 2500ms
  - CLS < 0.05 (DESIGN.md contract — strict; do NOT relax to 0.1)
  - TBT < 300ms (used as INP proxy; lab-mode Lighthouse rarely reports true INP)
- [ ] If any threshold fails: investigate. Common culprits: MapLibre bundle (lazy-load via dynamic if LCP blocked), font-loading CLS (verify `font-display: swap` + `next/font` `adjustFontFallback`), hero layout shift (confirm `aspect-ratio` on map container per Task 9c/14)
- [ ] Iterate until all thresholds pass; re-deploy via `vercel` and re-audit
- [ ] Commit any perf fixes: `perf: …`

**Verification:**
- `lighthouse.json` contains metrics within thresholds
- Print a summary: "LCP 2.1s · CLS 0.04 · INP 180ms · PASS"

## Task 28a: Update Gmail draft

**Depends on:** Task 27b

**Steps:**
- [ ] Read `.vercel-preview-url`
- [ ] **Try path A (MCP):** Use Google Workspace MCP `mcp__google-workspace__search_emails` with query `thread:19db594d4df80906 is:draft` to find the current draft. Update draft via the appropriate MCP call (check `mcp__google-workspace__get_status` first if any MCP error).
- [ ] **Path B (MCP fallback):** If update-draft MCP path is unavailable, delete the existing draft + recreate with identical headers and an updated body that swaps the 2-pager link for the deployed URL.
- [ ] **Path C (manual fallback, no MCP required):** If both MCP paths fail, print to stdout: (1) the deployed URL, (2) the Gmail draft thread id `19db594d4df80906`, (3) the exact replacement instruction — "Open https://mail.google.com/mail/u/0/#drafts, find the draft in thread 19db594d4df80906, replace the 2-pager Drive link with the deployed URL." Surface this to Dustin for manual completion and mark Task 28a complete once Dustin confirms.
- [ ] Verify new draft text contains the deployed URL (if path A or B) OR confirm with Dustin that manual edit is done (if path C)
- [ ] No commit (Gmail is external state)

**Verification:**
- Gmail draft now links to the Vercel preview URL instead of the 2-pager Doc
- The 2-pager link is either removed entirely or clearly relabeled as "Archived 2-pager (PDF)"

## Task 28b: Update memory file

**Depends on:** Task 27

**Steps:**
- [ ] Read `/Users/dustin/.claude/projects/-Users-dustin-projects-clients/memory/project_abound_feed_oc.md`
- [ ] Update:
  - Add deployed Vercel URL
  - Mark proposal-site status: "Deployed (preview). 2-pagers secondary."
  - **Fix the incorrect symlink claim:** per PLAN-REVISIONS.md, `clients/prospects` is NOT a symlink. Remove or correct that sentence.
  - Update last-updated date stamp to 2026-04-22 (absolute date per CLAUDE.md memory rules)
- [ ] Update `MEMORY.md` index line to match if the memory's description changed

**Verification:**
- `grep "vercel.app" project_abound_feed_oc.md` returns the new URL
- `grep -i symlink project_abound_feed_oc.md` — either absent or corrected

## Task 28c: Write CHANGELOG.md

**Depends on:** Task 27

**Steps:**
- [ ] Create `CHANGELOG.md` in repo root:

```md
# Changelog — OC Pantry Coordination Network Proposal Site

## v0.1.0 — 2026-04-22 — Initial deploy

- Single-page Vercel site with interactive Anaheim map and shared database table
- Direction: Soft Structuralism (locked after 5-way review, see docs/design/DESIGN.md)
- Representative data: 20 Anaheim distribution sites, 3 overlap-flagged (Lincoln Ave cluster)
- Hero + SharedDatabase (new in v2) + the 10 narrative sections from docs/superpowers/specs/2026-04-22-proposal-site-design.md §4.3
- Accessibility: WCAG AA contrast validated (lib/contrast.ts unit tests), keyboard-reachable throughout, prefers-reduced-motion respected
- Performance: Lighthouse mobile LCP < 2.5s / CLS < 0.05 / TBT < 300ms (DESIGN.md §10.2)
```

- [ ] Commit: `docs: CHANGELOG v0.1.0 initial deploy`

**Verification:**
- File exists, committed

---

## Sequencing summary

```
Phase 0 → 1a → 1b → 2 → 3 → 4 → 5 → 5b → 5c → 6b(optional)
                                            ↓
                     7 → 8 → 9a → 9b → 9c ──┤
                                            ↓
                            10a → 10b → 10c ┤
                                            ↓
                            11 → 12 → 13 ───┤
                                            ↓
          14 (Hero uses 9c + 11)            ↓
          15 16 17 18 19 20 21 22 23 24     ┤  (parallel after 14)
                                            ↓
                          25 → 26 → 27 ─────┤
                                            ↓
                    27b → 28a 28b 28c       ┘
```

Tasks 15–24 can run in parallel after Task 14 (Hero) lands, since they share no code and use the same SITE data + design tokens. Dispatch each as a fresh subagent. Task 15–24 subagents should be pointed at their specific DESIGN.md §7.N treatment.

---

## Post-deploy

- Victoria reviews the deployed site before 2026-04-28 and approves (with or without edits)
- Mike reviews the polished version before 2026-05-05 09:00 PT and the call uses the site as the primary artifact
- The deployed URL is linked into the Drive `Prospects/Abound/Proposal` folder (Task 6b or Drive manual add)
- Zero AI-slop-checklist violations at final review
- The site has zero typos, zero broken links, and every claim has a source or is labeled "representative"
