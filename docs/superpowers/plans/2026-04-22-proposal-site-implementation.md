# OC Pantry Coordination Network Proposal Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed, single-page Vercel site at a preview URL that serves as the primary external artifact pitching the OC Pantry Coordination Network to Victoria Torres (first) and Mike at Abound Food Care (second).

**Architecture:** Next.js 16 App Router monolith, one `page.tsx` that assembles ten section components. Representative data is a static GeoJSON file (no database, no auth, no backend). An `InteractiveMap` component wraps MapLibre GL JS and renders Anaheim distribution dots with client-side filter chips. Design direction is data-forward (Our World in Data / USAFacts / The Pudding), rendered with Tailwind v4 design tokens and shadcn/ui primitives. Brand colors and DM Sans inherit from the Datawake brand guide.

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript 5.x, Tailwind CSS v4, shadcn/ui, MapLibre GL JS, Framer Motion (sparingly), Vitest + React Testing Library + jest-axe, pnpm, Vercel.

**Source:** `/Users/dustin/projects/clients/prospects/Abound/Proposal/` (local, not Drive-synced). Symlinked from `/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/Proposal`.

**Spec:** `docs/superpowers/specs/2026-04-22-proposal-site-design.md`. Read it before starting Task 1.

---

## File structure (target)

```
Proposal/
├── .gitignore
├── .prettierrc
├── .prettierignore
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
├── components.json                              # shadcn config
├── app/
│   ├── layout.tsx                               # root layout, DM Sans, metadata
│   ├── page.tsx                                 # single-page assembly
│   ├── globals.css                              # Tailwind v4 @theme + design tokens
│   ├── favicon.ico
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                                      # shadcn primitives
│   ├── site/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── Picture.tsx                          # Strategic Planner (lead)
│   │   ├── Coordination.tsx                     # Conversational pantry loop
│   │   ├── LiveState.tsx                        # Abound console
│   │   ├── CaseManager.tsx
│   │   ├── PublicInfrastructure.tsx
│   │   ├── Team.tsx
│   │   ├── Scope.tsx
│   │   └── CTA.tsx
│   └── map/
│       ├── InteractiveMap.tsx                   # MapLibre wrapper
│       ├── FilterChips.tsx
│       └── MapTooltip.tsx
├── lib/
│   ├── site-data.ts                             # typed copy constants
│   ├── map-data.ts                              # GeoJSON types
│   ├── map-filters.ts                           # filter logic (unit-tested)
│   ├── slop-lint.ts                             # AI-slop word lint
│   └── utils.ts                                 # shadcn cn()
├── public/
│   ├── data/
│   │   └── anaheim-distributions.geojson
│   ├── logos/
│   │   ├── datawake-lockup.png
│   │   └── abound-lockup.svg
│   └── favicon.ico
├── tests/
│   ├── unit/
│   │   ├── map-filters.test.ts
│   │   └── slop-lint.test.ts
│   ├── components/
│   │   ├── Hero.test.tsx
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
└── docs/
    └── superpowers/
        ├── specs/2026-04-22-proposal-site-design.md
        └── plans/2026-04-22-proposal-site-implementation.md
```

---

## Phase 1 — Foundation

### Task 1: Scaffold Next.js 16 project

**Files:**
- Modify: `/Users/dustin/projects/clients/prospects/Abound/Proposal/.gitignore`
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/package.json` (via create-next-app)
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/tsconfig.json`
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/next.config.ts`
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/app/layout.tsx`
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/app/page.tsx`
- Create: `/Users/dustin/projects/clients/prospects/Abound/Proposal/app/globals.css`

- [ ] **Step 1: Initialize git**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
git init
git branch -m main
```

- [ ] **Step 2: Verify Next.js 16 is current via Context7 before scaffolding**

Use the Context7 MCP to confirm the correct `create-next-app` invocation for Next.js 16:

```
resolve-library-id "next.js"
query-docs <id> "create-next-app flags Next.js 16"
```

Expected: confirms `--typescript --tailwind --app --eslint --import-alias "@/*" --no-src-dir --use-pnpm --turbopack` are all valid. If any flag has renamed, update Step 3 before running.

- [ ] **Step 3: Scaffold Next.js into the current directory**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
pnpm create next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --import-alias "@/*" \
  --no-src-dir \
  --use-pnpm \
  --turbopack
```

Expected: scaffolds Next.js 16, creates `package.json`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `public/`. Install completes.

If prompted about non-empty directory: accept (existing `.superpowers/` and `docs/` do not conflict).

- [ ] **Step 4: Verify dev server runs**

```bash
pnpm dev
```

Expected: Next.js starts on `http://localhost:3000`, default Next.js template page renders. Ctrl+C to stop.

- [ ] **Step 5: Update `.gitignore` to include expected extras**

Replace `/Users/dustin/projects/clients/prospects/Abound/Proposal/.gitignore` contents with:

```
# next.js
.next/
out/
build/
dist/

# dependencies
node_modules/
.pnpm-store/

# env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# macOS
.DS_Store

# editor
.vscode/
.idea/

# brainstorming artifacts (local only)
.superpowers/

# logs
*.log
pnpm-debug.log*

# vercel
.vercel/

# testing
coverage/
```

- [ ] **Step 6: Install runtime dependencies**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
pnpm add maplibre-gl framer-motion clsx tailwind-merge class-variance-authority
pnpm add lucide-react @radix-ui/react-slot
```

Expected: MapLibre, Framer Motion, shadcn-required utilities install cleanly. Lockfile updated.

- [ ] **Step 7: Install dev / test dependencies**

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  jest-axe @types/jest-axe \
  prettier prettier-plugin-tailwindcss
```

Expected: install completes; `package.json` updated.

- [ ] **Step 8: Commit scaffold**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
git add -A
git commit -m "chore: scaffold Next.js 16 + Tailwind v4 + tooling

pnpm create next-app with App Router, Tailwind v4, TypeScript, Turbopack.
Adds MapLibre, Framer Motion, Vitest, React Testing Library, jest-axe."
```

---

### Task 2: Install and configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/tooltip.tsx`
- Create: `lib/utils.ts`

- [ ] **Step 1: Initialize shadcn**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
pnpm dlx shadcn@latest init
```

Answers to prompts:
- TypeScript: Yes
- Style: New York (consistent with Datawake product family)
- Base color: Neutral (we override with brand tokens)
- Global CSS file: `app/globals.css`
- CSS variables: Yes
- Tailwind config: (Tailwind v4 uses `@theme` inside CSS, no tailwind.config.js — shadcn detects this)
- Import alias: `@/components`, `@/lib`, `@/components/ui`, `@/hooks`

Expected: creates `components.json`, `lib/utils.ts` (with `cn()` helper), updates `app/globals.css`.

- [ ] **Step 2: Install base shadcn components**

```bash
pnpm dlx shadcn@latest add button card badge tooltip
```

Expected: creates `components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `tooltip.tsx`.

- [ ] **Step 3: Verify imports and types compile**

```bash
pnpm exec tsc --noEmit
```

Expected: exit code 0, no type errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add shadcn/ui base components (button, card, badge, tooltip)"
```

---

### Task 3: Configure design tokens in globals.css

**Files:**
- Modify: `app/globals.css`

Design tokens encode the Datawake brand (teal `#0C7C8A`, dark teal `#085A66`, warm gold `#D4A843`), DM Sans typography, and the data-forward palette.

- [ ] **Step 1: Overwrite `app/globals.css` with design-token block**

```css
@import "tailwindcss";

@theme {
  /* Datawake brand */
  --color-brand-primary: #0C7C8A;
  --color-brand-primary-dark: #085A66;
  --color-brand-primary-light: #E8F5F7;
  --color-brand-gold: #D4A843;
  --color-brand-gold-dark: #92710A;
  --color-brand-gold-light: #FFF8E7;

  /* Neutrals */
  --color-ink: #1A1A1A;
  --color-ink-heading: #1C2D3A;
  --color-ink-muted: #6B7280;
  --color-rule: #E2E8F0;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F7F9FA;

  /* Status */
  --color-success: #10B981;
  --color-warning: #D4A843;
  --color-error: #E05252;

  /* Type scale (data-forward: numbers get their own scale) */
  --font-sans: 'DM Sans', Arial, Helvetica, sans-serif;
  --font-number: 'DM Sans', Arial, Helvetica, sans-serif;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 160ms;
  --dur-normal: 280ms;
}

@layer base {
  html {
    color: var(--color-ink);
    background: var(--color-surface);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  body {
    min-height: 100svh;
  }

  h1, h2, h3, h4 {
    color: var(--color-ink-heading);
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  h1 { font-size: clamp(2.25rem, 4.5vw, 3.5rem); line-height: 1.05; letter-spacing: -0.02em; }
  h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); line-height: 1.15; }
  h3 { font-size: clamp(1.1rem, 1.8vw, 1.375rem); line-height: 1.25; font-weight: 600; }

  p  { line-height: 1.6; }

  ::selection {
    background: var(--color-brand-primary);
    color: var(--color-surface);
  }

  :focus-visible {
    outline: 2px solid var(--color-brand-primary);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* Utility class: tabular numbers for data */
.tabular {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

/* Utility class: uppercase letter-tracked meta label */
.label-meta {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

/* Utility class: data-forward large number */
.data-number {
  font-weight: 700;
  font-size: clamp(1.75rem, 2.5vw, 2.25rem);
  line-height: 1;
  color: var(--color-brand-primary);
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Verify build compiles**

```bash
pnpm build
```

Expected: Build succeeds. No Tailwind errors. CSS tokens resolved.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): Datawake brand tokens + type scale + motion rules"
```

---

### Task 4: Configure root layout with DM Sans and metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Overwrite `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'OC Pantry Coordination Network',
  description:
    'Shared food-rescue data for Orange County. Open directory, live distribution state, and public APIs. Built with Abound Food Care.',
  openGraph: {
    title: 'OC Pantry Coordination Network',
    description:
      'Shared food-rescue data for Orange County. Open directory, live distribution state, and public APIs. Built with Abound Food Care.',
    type: 'website',
  },
  robots: { index: true, follow: true },
  themeColor: '#0C7C8A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server renders with DM Sans**

```bash
pnpm dev
```

Open `http://localhost:3000`. Body text should render in DM Sans (verify via browser devtools: Computed → font-family contains "DM Sans"). Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(layout): root layout with DM Sans and site metadata"
```

---

### Task 5: Configure Vitest + React Testing Library

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add scripts)
- Modify: `tsconfig.json` (include test paths)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 2: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Add scripts to `package.json`**

In `package.json`, add to `"scripts"`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 4: Write a smoke test to verify the harness works**

Create `tests/unit/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('math still works', () => {
    expect(2 + 2).toBe(4);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: 1 test passes, 0 fail.

- [ ] **Step 6: Remove smoke test**

```bash
rm tests/unit/smoke.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(test): configure Vitest + React Testing Library + jest-axe"
```

---

### Task 6: Create Drive symlink

**Files:**
- Create symlink at `/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/Proposal`

- [ ] **Step 1: Verify target path exists**

```bash
ls -d /Users/dustin/projects/clients/prospects/Abound/Proposal
```

Expected: path listed.

- [ ] **Step 2: Verify Drive source path exists**

```bash
ls -d "/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/"
```

Expected: Abound folder listed.

- [ ] **Step 3: Create symlink**

```bash
ln -s /Users/dustin/projects/clients/prospects/Abound/Proposal \
  "/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/Proposal"
```

Expected: no output.

- [ ] **Step 4: Verify symlink resolves**

```bash
ls -la "/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/" | grep Proposal
```

Expected: line shows `Proposal -> /Users/dustin/projects/clients/prospects/Abound/Proposal`.

Note: Google Drive File Stream may render this as a regular file marker; that is acceptable for Dustin's local navigation. Other shared-drive users will not see contents (symlinks do not sync across Drive users), which is intentional — the site lives on Vercel, not in Drive.

- [ ] **Step 5: No git commit required** (symlink is outside the repo)

---

## Phase 2 — Map data and filter logic

### Task 7: Representative Anaheim GeoJSON

**Files:**
- Create: `public/data/anaheim-distributions.geojson`
- Create: `lib/map-data.ts`

- [ ] **Step 1: Define types in `lib/map-data.ts`**

```ts
export type DistributionType = 'pantry' | 'frc' | 'school' | 'mobile' | 'appointment';
export type DistributionModel = 'box' | 'choice';
export type StorageBadge = 'cold' | 'dry';

export interface DistributionFeatureProperties {
  id: string;
  name: string;
  type: DistributionType;
  model: DistributionModel;
  storage: StorageBadge[];
  nextDistribution: string;        // ISO or human string, representative
  hours: string;                   // e.g. "Tue 4-6pm, Sat 9-11am"
  capacityLabel: 'open' | 'partial' | 'full' | 'closed';
  specificNeeds: string[];         // e.g. ["pasta", "canned protein"]
  isOverlap: boolean;
  neighborhood: string;
}

export interface DistributionFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];  // [lng, lat]
  };
  properties: DistributionFeatureProperties;
}

export interface DistributionFeatureCollection {
  type: 'FeatureCollection';
  features: DistributionFeature[];
}

export const DATA_DISCLAIMER =
  'Representative demo data. Live coordination layer in development.';
```

- [ ] **Step 2: Create `public/data/anaheim-distributions.geojson`**

Representative data spanning Anaheim. ~20 features. Three features in a tight Saturday 9am cluster on Lincoln Ave (the gold-flagged overlap). One Monday-through-Wednesday gap neighborhood (92802 area) deliberately sparse. A mix of types, models, and storage.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9145, 33.8364] },
      "properties": {
        "id": "anh-001",
        "name": "St. Mark's Community Pantry",
        "type": "pantry",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Tue 4-6pm",
        "hours": "Tue 4-6pm, Sat 9-11am",
        "capacityLabel": "partial",
        "specificNeeds": ["pasta", "canned protein"],
        "isOverlap": false,
        "neighborhood": "Central Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9042, 33.8351] },
      "properties": {
        "id": "anh-002",
        "name": "Magnolia Elementary Food Shelf",
        "type": "school",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Thu 3-4pm",
        "hours": "Thu 3-4pm (school weeks)",
        "capacityLabel": "open",
        "specificNeeds": ["diapers", "kid-friendly snacks"],
        "isOverlap": false,
        "neighborhood": "Magnolia SD"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9338, 33.8366] },
      "properties": {
        "id": "anh-003",
        "name": "Anaheim FRC",
        "type": "frc",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Wed 10am-12pm",
        "hours": "Mon-Fri 9am-5pm",
        "capacityLabel": "open",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Central Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8891, 33.8343] },
      "properties": {
        "id": "anh-004",
        "name": "First Baptist Lincoln",
        "type": "pantry",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Sat 9-11am",
        "hours": "Sat 9-11am",
        "capacityLabel": "full",
        "specificNeeds": [],
        "isOverlap": true,
        "neighborhood": "East Anaheim (Lincoln cluster)"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8901, 33.8351] },
      "properties": {
        "id": "anh-005",
        "name": "St. Luke's Lutheran Pantry",
        "type": "pantry",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Sat 9-11am",
        "hours": "Sat 9-11am",
        "capacityLabel": "partial",
        "specificNeeds": ["pasta"],
        "isOverlap": true,
        "neighborhood": "East Anaheim (Lincoln cluster)"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8912, 33.8335] },
      "properties": {
        "id": "anh-006",
        "name": "Community Presbyterian Pantry",
        "type": "pantry",
        "model": "box",
        "storage": [],
        "nextDistribution": "Sat 10am-12pm",
        "hours": "Sat 10am-12pm",
        "capacityLabel": "open",
        "specificNeeds": ["canned fruit"],
        "isOverlap": true,
        "neighborhood": "East Anaheim (Lincoln cluster)"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9421, 33.8269] },
      "properties": {
        "id": "anh-007",
        "name": "Love Anaheim Distribution (Tue)",
        "type": "appointment",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Tue 1-3pm",
        "hours": "Tue 1-3pm (appointment)",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "West Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9511, 33.8318] },
      "properties": {
        "id": "anh-008",
        "name": "Family Resource Center West",
        "type": "frc",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Fri 9am-12pm",
        "hours": "Mon-Fri 9am-5pm",
        "capacityLabel": "open",
        "specificNeeds": ["baby formula"],
        "isOverlap": false,
        "neighborhood": "West Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8659, 33.8509] },
      "properties": {
        "id": "anh-009",
        "name": "Crescent Elementary Food Pantry",
        "type": "school",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Fri 3-4pm",
        "hours": "Fri 3-4pm (school weeks)",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "North Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8722, 33.8436] },
      "properties": {
        "id": "anh-010",
        "name": "Pathways of Hope Center",
        "type": "frc",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Mon 10am-2pm",
        "hours": "Mon, Wed, Fri 10am-2pm",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "North Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9123, 33.8271] },
      "properties": {
        "id": "anh-011",
        "name": "Mobile Community Center (Green Truck)",
        "type": "mobile",
        "model": "choice",
        "storage": ["dry"],
        "nextDistribution": "Thu 11am-1pm",
        "hours": "Rotating schedule, 3 stops/week",
        "capacityLabel": "open",
        "specificNeeds": ["produce"],
        "isOverlap": false,
        "neighborhood": "Rotates"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9267, 33.8461] },
      "properties": {
        "id": "anh-012",
        "name": "Orange Blossom AME Pantry",
        "type": "pantry",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Sun 12-2pm",
        "hours": "Sun 12-2pm",
        "capacityLabel": "full",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Central Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9015, 33.8195] },
      "properties": {
        "id": "anh-013",
        "name": "Sycamore Junior High Food Shelf",
        "type": "school",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Wed 3-4pm",
        "hours": "Wed 3-4pm (school weeks)",
        "capacityLabel": "open",
        "specificNeeds": ["snacks"],
        "isOverlap": false,
        "neighborhood": "South Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9382, 33.8521] },
      "properties": {
        "id": "anh-014",
        "name": "Anaheim Hills FRC",
        "type": "frc",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Tue 2-5pm",
        "hours": "Tue, Thu 2-5pm",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Anaheim Hills"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8843, 33.8278] },
      "properties": {
        "id": "anh-015",
        "name": "Iglesia de Fe Despensa",
        "type": "pantry",
        "model": "choice",
        "storage": ["dry"],
        "nextDistribution": "Wed 5-7pm",
        "hours": "Wed 5-7pm",
        "capacityLabel": "open",
        "specificNeeds": ["beans", "rice"],
        "isOverlap": false,
        "neighborhood": "East Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9194, 33.8455] },
      "properties": {
        "id": "anh-016",
        "name": "Resurrection Lutheran Pantry",
        "type": "pantry",
        "model": "box",
        "storage": ["cold"],
        "nextDistribution": "Fri 4-6pm",
        "hours": "Fri 4-6pm",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Central Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.8974, 33.8502] },
      "properties": {
        "id": "anh-017",
        "name": "Platinum Triangle School Food Shelf",
        "type": "school",
        "model": "box",
        "storage": ["dry"],
        "nextDistribution": "Thu 3-4pm",
        "hours": "Thu 3-4pm (school weeks)",
        "capacityLabel": "open",
        "specificNeeds": ["kid-friendly snacks"],
        "isOverlap": false,
        "neighborhood": "Platinum Triangle"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9588, 33.8195] },
      "properties": {
        "id": "anh-018",
        "name": "West Anaheim Mobile Pop-up",
        "type": "mobile",
        "model": "choice",
        "storage": [],
        "nextDistribution": "Sat 11am-1pm",
        "hours": "Sat 11am-1pm (rotating)",
        "capacityLabel": "open",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "West Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9051, 33.8412] },
      "properties": {
        "id": "anh-019",
        "name": "All Saints Catholic Pantry",
        "type": "pantry",
        "model": "box",
        "storage": ["cold", "dry"],
        "nextDistribution": "Sat 9-11am",
        "hours": "Sat 9-11am",
        "capacityLabel": "full",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Central Anaheim"
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-117.9177, 33.8599] },
      "properties": {
        "id": "anh-020",
        "name": "Canyon FRC",
        "type": "frc",
        "model": "choice",
        "storage": ["cold", "dry"],
        "nextDistribution": "Tue 11am-2pm",
        "hours": "Tue, Fri 11am-2pm",
        "capacityLabel": "partial",
        "specificNeeds": [],
        "isOverlap": false,
        "neighborhood": "Anaheim Hills"
      }
    }
  ]
}
```

- [ ] **Step 3: Write validation test**

Create `tests/unit/map-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import geojson from '@/public/data/anaheim-distributions.geojson' with { type: 'json' };
import type { DistributionFeatureCollection } from '@/lib/map-data';

describe('anaheim-distributions.geojson', () => {
  const fc = geojson as unknown as DistributionFeatureCollection;

  it('is a FeatureCollection', () => {
    expect(fc.type).toBe('FeatureCollection');
  });

  it('has at least 15 features', () => {
    expect(fc.features.length).toBeGreaterThanOrEqual(15);
  });

  it('every feature is a point within Anaheim bounds', () => {
    for (const f of fc.features) {
      expect(f.geometry.type).toBe('Point');
      const [lng, lat] = f.geometry.coordinates;
      expect(lng).toBeGreaterThan(-118.05);
      expect(lng).toBeLessThan(-117.70);
      expect(lat).toBeGreaterThan(33.79);
      expect(lat).toBeLessThan(33.89);
    }
  });

  it('every feature has unique id', () => {
    const ids = fc.features.map((f) => f.properties.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes at least 3 features flagged as overlap', () => {
    const overlaps = fc.features.filter((f) => f.properties.isOverlap);
    expect(overlaps.length).toBeGreaterThanOrEqual(3);
  });

  it('every feature has valid type enum', () => {
    const allowed = ['pantry', 'frc', 'school', 'mobile', 'appointment'];
    for (const f of fc.features) {
      expect(allowed).toContain(f.properties.type);
    }
  });
});
```

- [ ] **Step 4: Enable JSON module imports in `tsconfig.json`**

Add `"resolveJsonModule": true` to `compilerOptions` if not already present. Also add `"public/**/*.geojson"` to `include` so TypeScript can type-check it:

Before:
```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
```

After:
```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "public/**/*.geojson"]
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected: all 6 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(data): representative Anaheim distribution GeoJSON + type defs

~20 representative distribution features within Anaheim bounds, 3 in an
overlap cluster on Lincoln Ave (Saturday 9am), mix of types/models/storage.
Typed via lib/map-data.ts. Labeled as demo data in accompanying copy."
```

---

### Task 8: Map filter logic (TDD)

**Files:**
- Create: `tests/unit/map-filters.test.ts`
- Create: `lib/map-filters.ts`

Pure-function filter logic for the filter chips. TDD: tests first.

- [ ] **Step 1: Write failing tests**

Create `tests/unit/map-filters.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { filterFeatures, DEFAULT_FILTER_STATE, type FilterState } from '@/lib/map-filters';
import type { DistributionFeatureCollection } from '@/lib/map-data';

const sample: DistributionFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-117.9, 33.83] },
      properties: {
        id: 'a',
        name: 'Alpha',
        type: 'pantry',
        model: 'choice',
        storage: ['cold', 'dry'],
        nextDistribution: 'Tue',
        hours: '',
        capacityLabel: 'partial',
        specificNeeds: [],
        isOverlap: false,
        neighborhood: 'Central',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-117.9, 33.83] },
      properties: {
        id: 'b',
        name: 'Beta',
        type: 'pantry',
        model: 'box',
        storage: ['dry'],
        nextDistribution: 'Sat',
        hours: '',
        capacityLabel: 'open',
        specificNeeds: ['pasta'],
        isOverlap: true,
        neighborhood: 'East',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-117.9, 33.83] },
      properties: {
        id: 'c',
        name: 'Gamma',
        type: 'frc',
        model: 'choice',
        storage: [],
        nextDistribution: 'Sat',
        hours: '',
        capacityLabel: 'closed',
        specificNeeds: [],
        isOverlap: false,
        neighborhood: 'West',
      },
    },
  ],
};

describe('filterFeatures', () => {
  it('returns all features when no filters active', () => {
    const result = filterFeatures(sample, DEFAULT_FILTER_STATE);
    expect(result.features).toHaveLength(3);
  });

  it('filters to features with cold storage', () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, hasColdStorage: true };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id)).toEqual(['a']);
  });

  it('filters to choice-market features', () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, isChoiceMarket: true };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id).sort()).toEqual(['a', 'c']);
  });

  it('filters to open (not full or closed) features', () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, isOpenToday: true };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id).sort()).toEqual(['a', 'b']);
  });

  it('filters to features with specific needs', () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, hasNeeds: true };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id)).toEqual(['b']);
  });

  it('filters to overlap-flagged features', () => {
    const state: FilterState = { ...DEFAULT_FILTER_STATE, isOverlapFlagged: true };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id)).toEqual(['b']);
  });

  it('combines filters with AND semantics', () => {
    const state: FilterState = {
      ...DEFAULT_FILTER_STATE,
      isChoiceMarket: true,
      hasColdStorage: true,
    };
    const result = filterFeatures(sample, state);
    expect(result.features.map((f) => f.properties.id)).toEqual(['a']);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test tests/unit/map-filters.test.ts
```

Expected: fail with `Cannot find module '@/lib/map-filters'` or equivalent.

- [ ] **Step 3: Implement `lib/map-filters.ts`**

```ts
import type {
  DistributionFeatureCollection,
  DistributionFeature,
} from './map-data';

export interface FilterState {
  isOpenToday: boolean;
  hasColdStorage: boolean;
  isChoiceMarket: boolean;
  hasNeeds: boolean;
  isOverlapFlagged: boolean;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  isOpenToday: false,
  hasColdStorage: false,
  isChoiceMarket: false,
  hasNeeds: false,
  isOverlapFlagged: false,
};

export function filterFeatures(
  fc: DistributionFeatureCollection,
  state: FilterState,
): DistributionFeatureCollection {
  const pass = (f: DistributionFeature): boolean => {
    if (state.isOpenToday && (f.properties.capacityLabel === 'full' || f.properties.capacityLabel === 'closed')) {
      return false;
    }
    if (state.hasColdStorage && !f.properties.storage.includes('cold')) {
      return false;
    }
    if (state.isChoiceMarket && f.properties.model !== 'choice') {
      return false;
    }
    if (state.hasNeeds && f.properties.specificNeeds.length === 0) {
      return false;
    }
    if (state.isOverlapFlagged && !f.properties.isOverlap) {
      return false;
    }
    return true;
  };

  return {
    type: 'FeatureCollection',
    features: fc.features.filter(pass),
  };
}

export function countActiveFilters(state: FilterState): number {
  return Object.values(state).filter(Boolean).length;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test tests/unit/map-filters.test.ts
```

Expected: 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(map): pure-function filter logic for distribution chips

AND-semantics filter combining open-today / cold-storage / choice-market /
has-needs / overlap-flagged. Full unit coverage."
```

---

### Task 9: InteractiveMap component (MapLibre GL JS)

**Files:**
- Create: `components/map/InteractiveMap.tsx`
- Create: `components/map/FilterChips.tsx`
- Create: `components/map/MapTooltip.tsx`
- Create: `tests/components/InteractiveMap.test.tsx`

- [ ] **Step 1: Write failing component test**

Create `tests/components/InteractiveMap.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveMap } from '@/components/map/InteractiveMap';

// MapLibre needs Canvas which jsdom lacks. Mock the library.
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      getSource: vi.fn(() => ({ setData: vi.fn() })),
      setFilter: vi.fn(),
      setMaxBounds: vi.fn(),
      fitBounds: vi.fn(),
    })),
    NavigationControl: vi.fn(),
  },
}));

describe('<InteractiveMap />', () => {
  it('renders filter chips and disclaimer', () => {
    render(<InteractiveMap />);
    expect(screen.getByRole('button', { name: /open today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cold storage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choice market/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /needs/i })).toBeInTheDocument();
    expect(screen.getByText(/representative demo data/i)).toBeInTheDocument();
  });

  it('toggles a filter chip to active state when clicked', async () => {
    const user = userEvent.setup();
    render(<InteractiveMap />);
    const chip = screen.getByRole('button', { name: /cold storage/i });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

```bash
pnpm test tests/components/InteractiveMap.test.tsx
```

Expected: fail with module-not-found.

- [ ] **Step 3: Implement `components/map/FilterChips.tsx`**

```tsx
'use client';

import type { FilterState } from '@/lib/map-filters';

interface ChipDef {
  key: keyof FilterState;
  label: string;
}

const CHIPS: ChipDef[] = [
  { key: 'isOpenToday', label: 'Open today' },
  { key: 'hasColdStorage', label: 'Cold storage' },
  { key: 'isChoiceMarket', label: 'Choice market' },
  { key: 'hasNeeds', label: 'Needs dry goods' },
  { key: 'isOverlapFlagged', label: 'Overlap flagged' },
];

interface FilterChipsProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
}

export function FilterChips({ state, onChange }: FilterChipsProps) {
  const toggle = (key: keyof FilterState) =>
    onChange({ ...state, [key]: !state[key] });

  return (
    <div
      role="group"
      aria-label="Filter distributions"
      className="flex flex-wrap gap-2 mt-3"
    >
      {CHIPS.map(({ key, label }) => {
        const active = state[key];
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(key)}
            className={[
              'rounded-full px-3 py-1.5 text-[13px] font-medium border transition-colors',
              active
                ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
                : 'bg-white text-[var(--color-ink)] border-[var(--color-rule)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Implement `components/map/MapTooltip.tsx`**

```tsx
import type { DistributionFeatureProperties } from '@/lib/map-data';

interface MapTooltipProps {
  properties: DistributionFeatureProperties;
}

export function MapTooltip({ properties }: MapTooltipProps) {
  return (
    <div className="font-sans" style={{ maxWidth: 240 }}>
      <div className="font-semibold text-[14px] text-[var(--color-ink-heading)]">
        {properties.name}
      </div>
      <div className="label-meta mt-1">
        {properties.type} · {properties.model} model
      </div>
      <div className="text-[13px] mt-2">
        <strong>Next:</strong> {properties.nextDistribution}
      </div>
      <div className="text-[13px]">
        <strong>Hours:</strong> {properties.hours}
      </div>
      {properties.storage.length > 0 && (
        <div className="text-[13px] mt-1">
          <strong>Storage:</strong> {properties.storage.join(', ')}
        </div>
      )}
      {properties.specificNeeds.length > 0 && (
        <div className="text-[13px] mt-1">
          <strong>Needs:</strong> {properties.specificNeeds.join(', ')}
        </div>
      )}
      {properties.isOverlap && (
        <div
          className="text-[11px] mt-2 font-semibold"
          style={{ color: 'var(--color-brand-gold-dark)' }}
        >
          OVERLAP FLAGGED · Saturday 9am cluster
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implement `components/map/InteractiveMap.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { createRoot, type Root } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';

import { FilterChips } from './FilterChips';
import { MapTooltip } from './MapTooltip';
import { DEFAULT_FILTER_STATE, filterFeatures, type FilterState } from '@/lib/map-filters';
import {
  DATA_DISCLAIMER,
  type DistributionFeatureCollection,
  type DistributionFeatureProperties,
} from '@/lib/map-data';

const SOURCE_ID = 'anaheim-distributions';
const LAYER_ID = 'anaheim-distributions-layer';
const OVERLAP_LAYER_ID = 'anaheim-overlap-layer';

const ANAHEIM_BOUNDS: [number, number, number, number] = [
  -118.05, 33.79, -117.70, 33.89,
];

const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  'https://tiles.openfreemap.org/styles/positron';

export function InteractiveMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRootRef = useRef<Root | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const dataRef = useRef<DistributionFeatureCollection | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // Load GeoJSON once
  useEffect(() => {
    let cancelled = false;
    fetch('/data/anaheim-distributions.geojson')
      .then((r) => r.json())
      .then((json: DistributionFeatureCollection) => {
        if (cancelled) return;
        dataRef.current = json;
        const src = mapRef.current?.getSource(SOURCE_ID);
        if (src && 'setData' in src) {
          (src as maplibregl.GeoJSONSource).setData(json);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Init map once
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      bounds: ANAHEIM_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      maxBounds: [
        [ANAHEIM_BOUNDS[0] - 0.1, ANAHEIM_BOUNDS[1] - 0.1],
        [ANAHEIM_BOUNDS[2] + 0.1, ANAHEIM_BOUNDS[3] + 0.1],
      ],
      minZoom: 10,
      maxZoom: 15,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      const initial: DistributionFeatureCollection =
        dataRef.current ?? { type: 'FeatureCollection', features: [] };

      map.addSource(SOURCE_ID, { type: 'geojson', data: initial });

      map.addLayer({
        id: LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 4,
            15, 8,
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'isOverlap'], true], '#D4A843',
            '#0C7C8A',
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': [
            'case',
            ['in', ['get', 'capacityLabel'], ['literal', ['closed']]], 0.4,
            1,
          ],
        },
      });

      map.on('mouseenter', LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', LAYER_ID, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', LAYER_ID, (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as unknown as DistributionFeatureProperties;
        const geom = feature.geometry as { type: 'Point'; coordinates: [number, number] };

        popupRef.current?.remove();
        const popupContainer = document.createElement('div');
        popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true })
          .setLngLat(geom.coordinates)
          .setDOMContent(popupContainer)
          .addTo(map);
        tooltipRootRef.current?.unmount();
        tooltipRootRef.current = createRoot(popupContainer);
        tooltipRootRef.current.render(<MapTooltip properties={props} />);
      });
    });

    mapRef.current = map;
    return () => {
      popupRef.current?.remove();
      tooltipRootRef.current?.unmount();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Apply filter state to source
  useEffect(() => {
    const src = mapRef.current?.getSource(SOURCE_ID);
    if (!src || !dataRef.current) return;
    const filtered = filterFeatures(dataRef.current, filterState);
    (src as maplibregl.GeoJSONSource).setData(filtered);
  }, [filterState]);

  return (
    <div>
      <div
        ref={containerRef}
        role="region"
        aria-label="Interactive map of representative distribution sites in Anaheim"
        className="w-full rounded-xl overflow-hidden border border-[var(--color-rule)]"
        style={{ height: 480 }}
      />
      <FilterChips state={filterState} onChange={setFilterState} />
      <p className="label-meta mt-3">{DATA_DISCLAIMER}</p>
    </div>
  );
}
```

- [ ] **Step 6: Run tests**

```bash
pnpm test tests/components/InteractiveMap.test.tsx
```

Expected: both tests pass (renders chips + disclaimer, toggles chip aria-pressed).

- [ ] **Step 7: Visual check in dev**

```bash
pnpm dev
```

Open `http://localhost:3000`. Temporarily replace `app/page.tsx` contents with:

```tsx
import { InteractiveMap } from '@/components/map/InteractiveMap';
export default function Page() {
  return <main className="max-w-4xl mx-auto p-8"><InteractiveMap /></main>;
}
```

Expected:
- Map renders, bounded to Anaheim
- Roughly 20 teal dots with one gold cluster on Lincoln Ave
- Clicking a dot opens a popup with the MapTooltip content
- Clicking "Cold storage" chip toggles it to teal and hides dots without cold storage
- Console is clean
- Ctrl+C

Revert `page.tsx` back to the default Next.js template for now (we rebuild it in Task 10).

```bash
git checkout app/page.tsx
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(map): InteractiveMap with MapLibre + filter chips + tooltip

Anaheim-bounded map, ~20 representative distribution dots, gold overlap
cluster, five filter chips with aria-pressed state, accessible tooltips,
prefers-reduced-motion respected. Data loaded from static GeoJSON."
```

---

## Phase 3 — Sections

For every section in this phase, the contract is: rendered component + unit test (render + copy-present + no-slop-lint). Draft copy is provided; subagent may refine at build time within the word-count targets from the spec, but the anchor phrases (quoted below) must be present verbatim so tests assert them.

### Task 10: Page skeleton + site data + slop lint

**Files:**
- Create: `lib/site-data.ts`
- Create: `lib/slop-lint.ts`
- Create: `tests/unit/slop-lint.test.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the slop-lint tests**

Create `tests/unit/slop-lint.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { findSlopPhrases, BANNED_PHRASES } from '@/lib/slop-lint';

describe('slop-lint', () => {
  it('has banned phrases defined', () => {
    expect(BANNED_PHRASES.length).toBeGreaterThan(5);
  });

  it('detects banned verbs', () => {
    const hits = findSlopPhrases('We empower nonprofits to leverage coordination.');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.phrase === 'empower')).toBe(true);
    expect(hits.some((h) => h.phrase === 'leverage')).toBe(true);
  });

  it('detects em dashes as clause separators', () => {
    const hits = findSlopPhrases('This is good — and it matters.');
    expect(hits.some((h) => h.phrase === 'em-dash')).toBe(true);
  });

  it('allows clean copy', () => {
    const hits = findSlopPhrases(
      'Shared food-rescue data for Orange County. Open directory. Live distribution state. Public APIs.',
    );
    expect(hits).toEqual([]);
  });

  it('is case-insensitive for phrase matches', () => {
    const hits = findSlopPhrases('Seamlessly unlock your workflow.');
    expect(hits.some((h) => h.phrase === 'seamlessly')).toBe(true);
    expect(hits.some((h) => h.phrase === 'unlock')).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
pnpm test tests/unit/slop-lint.test.ts
```

Expected: fails with module not found.

- [ ] **Step 3: Implement `lib/slop-lint.ts`**

```ts
export interface SlopHit {
  phrase: string;
  index: number;
}

export const BANNED_PHRASES = [
  'empower',
  'leverage',
  'unlock',
  'transform your',
  'seamlessly',
  'game-changer',
  'game changer',
  'move the needle',
  'unleash',
  'in today\'s fast-paced world',
  'synergy',
  'synergies',
  'revolutionize',
  'revolutionary',
  'best-in-class',
  'cutting-edge',
  'world-class',
  'take to the next level',
] as const;

export function findSlopPhrases(text: string): SlopHit[] {
  const lower = text.toLowerCase();
  const hits: SlopHit[] = [];

  for (const phrase of BANNED_PHRASES) {
    let idx = 0;
    while (true) {
      const found = lower.indexOf(phrase, idx);
      if (found === -1) break;
      hits.push({ phrase, index: found });
      idx = found + phrase.length;
    }
  }

  // Em-dash check (U+2014). Rule: no em dashes as clause separators anywhere.
  // Any em dash in user-facing copy is a hit (strict).
  let emIdx = 0;
  while (true) {
    const found = text.indexOf('—', emIdx);
    if (found === -1) break;
    hits.push({ phrase: 'em-dash', index: found });
    emIdx = found + 1;
  }

  return hits;
}
```

- [ ] **Step 4: Run tests to verify pass**

```bash
pnpm test tests/unit/slop-lint.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 5: Create `lib/site-data.ts` with typed copy constants**

```ts
// Central source of truth for all site copy. Keeps tests and components in sync.
export const SITE = {
  hero: {
    headline: 'Shared food-rescue data for Orange County.',
    subline:
      'Open directory. Live distribution state. Public APIs. Built with Abound Food Care.',
    primaryCta: { label: 'Read the proposal', href: '#picture' },
    secondaryCta: { label: 'How it works', href: '#coordination' },
  },

  problem: {
    sectionLabel: 'The problem',
    heading: 'A food-rescue system that cannot see itself.',
    body: `On a single Saturday morning in central Anaheim, three church pantries all open their doors at 9am within 300 meters of each other. Two blocks south, a family who needs food on a Monday has no pantry open within walking distance Monday through Wednesday. Second Harvest keeps a manual pantry list. 211 OC keeps another one. A Google Calendar was abandoned because no one had a reason to update it. Abound Food Care has a truck of cold-storage rescue food at 4pm Thursday and no live view of which pantries have room. The system moves tens of millions of pounds of food a year and cannot see itself.`,
  },

  picture: {
    sectionLabel: 'The picture',
    heading: 'One shared picture, used by coalition leaders.',
    body: `Every Sunday night, Victoria opens a single dashboard. She sees every scheduled distribution across Orange County this week: who is open Monday, who is closed for the holiday, who has cold storage, who is short on pasta. She sees every incoming supply event Abound has pulled from grocery rescue and donations. She sees where coverage drops to zero and where three pantries are colliding on the same block at the same time. The AI has drafted a weekly strategic brief: three overlaps flagged, one gap in 92802, a proposed consolidation at Anaheim FRC that would lift combined coverage by an estimated 32 percent. She reviews it, marks two scenarios to share with Mike, and closes the tab. The coalition now has one source of truth. That is what the OC Pantry Coordination Network is.`,
    callouts: [
      { label: 'Heat map', detail: 'Distribution density + demand overlays' },
      { label: 'Weekly AI brief', detail: 'Gaps, overlaps, consolidation candidates' },
      { label: 'Scenario tool', detail: 'Model "what if" consolidations before deciding' },
    ],
  },

  coordination: {
    sectionLabel: 'Coordination without a login',
    heading: 'Pantries stay in their inbox.',
    body: `Asking 300-plus pantry volunteers across Orange County to adopt a new app, remember a password, and learn a dashboard is the fastest way to kill a coordination system. The Network does not require it. Every Sunday evening, the platform texts or emails each site operator: "any updates for this week?" The operator replies in plain English. An AI parses capacity, needs, and schedule changes, updates the shared state, and replies with a confirmation. When Abound routes supply mid-week, the operator gets another short text. When the distribution ends, the operator texts "received, served 72." That is the entire weekly loop. No app, no password, no training.`,
    sampleExchange: [
      { from: 'system', text: 'Hi Karen. Any updates for St. Mark\'s this week? Reply with capacity, needs, changes, or "same as usual."' },
      { from: 'operator', text: 'Tuesday same, 80 bags, need pasta and canned protein, cold capacity ~150 lb. Saturday normal.' },
      { from: 'system', text: 'Got it. Tue 4 to 6pm: 80 bags, short on pasta/protein, 150 lb cold open. Sat 9 to 11am: usual. Reply CHANGE if wrong.' },
    ],
  },

  liveState: {
    sectionLabel: 'The live state',
    heading: 'Abound opens one console every morning.',
    body: `Mike\'s team at Abound Food Care opens a single console at the start of every shift. The left column shows today\'s supply pipeline: grocery rescue pickups, warehouse donations, corporate drives, each with source, estimated composition, and timing. The center shows this week\'s distributions, color-coded by supply state. The right column is the routing queue: the AI has already drafted which supply event should go to which distribution, ranked by storage fit, schedule, capacity, distance, and pantry data freshness. Abound confirms, overrides, or flags. The coordination layer above ChowMatch, 211 OC, and the rest of the ecosystem.`,
  },

  caseManager: {
    sectionLabel: 'A door for every family',
    heading: 'A case manager finds the right pantry in under a minute.',
    body: `A social worker at a Magnolia SD elementary school has a family in her office right now: three kids, Spanish-speaking, no transport. She types one sentence into the search: "walkable from 92804, open today, Spanish-speaking, no appointment, kid-friendly." She gets three ranked results with plain-English reasoning: the nearest is open in two hours, a 0.6-mile walk, choice model, Spanish-speaking volunteer, dry goods in stock. She copies a shareable link, texts it to the family, and walks them out. No family account is created. No searchable record of the family exists. The case manager handles the referral directly.`,
  },

  publicInfrastructure: {
    sectionLabel: 'Public infrastructure',
    heading: 'Open source. Public APIs. Any county can fork it.',
    body: `Most food-rescue systems keep their pantry data private. The OC Pantry Coordination Network does the opposite. The full codebase is open source (MIT or Apache 2.0, one license chosen at release). Every data point is available through a public, documented REST API. The OpenAPI specification is published on day one. A reference deployment runs for Orange County. Any other county, food bank, or coalition can fork the repository, point it at their own data, and run their own deployment without asking permission. That is the multiplier a grant pays for: Orange County funds the build once, and every other county gets to run it for the cost of hosting.`,
    codeSample: `GET /api/distributions?week=current&neighborhood=central-anaheim
{
  "distributions": [
    {
      "id": "dist_7f3a",
      "site": { "id": "site_st_marks", "name": "St. Mark\'s Community Pantry" },
      "start": "2026-04-28T16:00:00-07:00",
      "model": "choice",
      "capacity": { "current": "partial", "cold_lb_open": 150 },
      "needs": ["pasta", "canned protein"]
    }
  ]
}`,
  },

  team: {
    sectionLabel: 'Who is building this',
    heading: 'Three partners, three specific roles.',
    cards: [
      {
        name: 'Abound Food Care',
        role: 'Product owner, grant applicant, long-term operator',
        body: 'Orange County\'s food-rescue conductor. Transports food from grocery partners and corporate donors to pantries, FRCs, and schools that need it. The Network lives inside Abound\'s accounts.',
      },
      {
        name: 'A Million Dreams Consulting',
        role: 'Co-product manager, domain expert, adoption lead',
        body: 'Victoria Torres maintains the existing Anaheim pantry relationships, leads onboarding, and shapes the product from the operator side.',
      },
      {
        name: 'Datawake',
        role: 'Builder, maintainer, technology partner',
        body: 'Software consultancy delivering a production-grade open-source codebase on modern tooling: Next.js, Vercel, Postgres, AI SDK. Long-term maintenance included.',
      },
    ],
  },

  scope: {
    sectionLabel: 'V1 scope, timeline, budget',
    heading: 'What the first release delivers.',
    bullets: [
      'Shared entity model: distributions, supply events, sites, sources, transport',
      'Conversational pantry loop (email + SMS) with AI parsing',
      'Abound console: supply pipeline, distribution calendar, AI routing queue',
      'Strategic dashboard: heat map, weekly AI brief, scenario tool',
      'Case-manager natural-language search',
      'Progressive Web App for case managers and Abound field staff',
      'Public read APIs, OpenAPI spec, public GitHub repo',
      'Sanitized public read-only map (opt-in per site)',
    ],
    timeline: [
      { label: 'Grant submission', value: 'May 15, 2026 (Abound-led)' },
      { label: 'Build kickoff', value: 'Contingent on award' },
      { label: 'MVP delivery', value: '~6 months post-kickoff' },
      { label: 'Pilot footprint', value: 'Anaheim, expanding OC-wide' },
    ],
    budget: {
      build: '$100–200K build (one-time)',
      maintenance: '~$100K maintenance over 3 years',
      note:
        'Line item inside Abound\'s broader grant, not a standalone ask. Final figure confirmed with Abound before grant submission.',
    },
  },

  cta: {
    sectionLabel: 'Next steps',
    heading: 'Let us build this together.',
    body: 'For Victoria: reply in the email thread with comments. For Mike: we have 9am PT on Tuesday May 5 on the calendar.',
    links: [
      { label: 'Email Dustin', href: 'mailto:dustin@datawake.io' },
      { label: 'Book a call', href: 'https://cal.com/dustin-datawake' },
    ],
  },
} as const;
```

- [ ] **Step 6: Write a page-level slop-free assertion test**

Create `tests/unit/site-copy-lint.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { SITE } from '@/lib/site-data';
import { findSlopPhrases } from '@/lib/slop-lint';

function allStrings(obj: unknown, acc: string[] = []): string[] {
  if (typeof obj === 'string') { acc.push(obj); return acc; }
  if (Array.isArray(obj)) { for (const v of obj) allStrings(v, acc); return acc; }
  if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj)) allStrings(v, acc);
  }
  return acc;
}

describe('SITE copy', () => {
  it('contains zero AI-slop phrases or em-dash clause separators', () => {
    const strings = allStrings(SITE);
    const hits = strings.flatMap((s) => findSlopPhrases(s));
    expect(hits, `Slop in copy: ${JSON.stringify(hits)}`).toEqual([]);
  });
});
```

- [ ] **Step 7: Run site-copy lint**

```bash
pnpm test tests/unit/site-copy-lint.test.ts
```

Expected: passes. If it fails, the failure message lists each phrase and its location; edit `lib/site-data.ts` until clean.

- [ ] **Step 8: Rewrite `app/page.tsx` as the section-assembly skeleton**

```tsx
import { Hero } from '@/components/site/Hero';
import { Problem } from '@/components/site/Problem';
import { Picture } from '@/components/site/Picture';
import { Coordination } from '@/components/site/Coordination';
import { LiveState } from '@/components/site/LiveState';
import { CaseManager } from '@/components/site/CaseManager';
import { PublicInfrastructure } from '@/components/site/PublicInfrastructure';
import { Team } from '@/components/site/Team';
import { Scope } from '@/components/site/Scope';
import { CTA } from '@/components/site/CTA';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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

This will fail to compile until each component exists. That is expected. Subsequent tasks add each one.

- [ ] **Step 9: Create a temporary `not-ready.tsx` placeholder so `pnpm build` can compile**

Create `components/site/not-ready.tsx`:

```tsx
export function NotReady({ name }: { name: string }) {
  return (
    <section className="border-2 border-dashed border-[var(--color-rule)] p-8 my-8 text-[var(--color-ink-muted)]">
      Placeholder: {name}
    </section>
  );
}
```

Create stubs for every section component that route through NotReady. E.g. `components/site/Hero.tsx`:

```tsx
import { NotReady } from './not-ready';
export function Hero() { return <NotReady name="Hero" />; }
```

Create equivalent stubs for: `Problem`, `Picture`, `Coordination`, `LiveState`, `CaseManager`, `PublicInfrastructure`, `Team`, `Scope`, `CTA`, `Header`, `Footer` — each one file, each exporting a function of its name that renders `<NotReady name="{name}" />`.

- [ ] **Step 10: Verify build passes**

```bash
pnpm build
```

Expected: success. All imports resolve.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(site): page skeleton, site-data constants, slop lint

lib/site-data.ts holds all copy as typed constants. lib/slop-lint.ts
bans AI-slop phrases and em-dash clause separators. app/page.tsx
assembles 10 section stubs. All copy passes slop lint."
```

---

### Task 11: Hero section

**Files:**
- Modify: `components/site/Hero.tsx`
- Create: `tests/components/Hero.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Hero.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/site/Hero';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(), off: vi.fn(), remove: vi.fn(),
      addSource: vi.fn(), addLayer: vi.fn(),
      getSource: vi.fn(() => ({ setData: vi.fn() })),
      setFilter: vi.fn(), setMaxBounds: vi.fn(), fitBounds: vi.fn(),
      addControl: vi.fn(),
      getCanvas: vi.fn(() => ({ style: {} })),
    })),
    NavigationControl: vi.fn(),
    Popup: vi.fn(),
  },
}));

describe('<Hero />', () => {
  it('renders the H1 headline verbatim', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1, name: /shared food-rescue data for orange county/i }),
    ).toBeInTheDocument();
  });

  it('renders the subline', () => {
    render(<Hero />);
    expect(screen.getByText(/open directory/i)).toBeInTheDocument();
    expect(screen.getByText(/built with abound food care/i)).toBeInTheDocument();
  });

  it('renders both CTAs with correct hrefs', () => {
    render(<Hero />);
    const primary = screen.getByRole('link', { name: /read the proposal/i });
    expect(primary).toHaveAttribute('href', '#picture');
    const secondary = screen.getByRole('link', { name: /how it works/i });
    expect(secondary).toHaveAttribute('href', '#coordination');
  });

  it('includes the interactive map region', () => {
    render(<Hero />);
    expect(
      screen.getByRole('region', { name: /interactive map/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
pnpm test tests/components/Hero.test.tsx
```

Expected: test fails because Hero is a NotReady stub.

- [ ] **Step 3: Implement `components/site/Hero.tsx`**

```tsx
import Link from 'next/link';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { SITE } from '@/lib/site-data';

export function Hero() {
  return (
    <section className="relative border-b border-[var(--color-rule)]">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20 grid gap-10 md:gap-14 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="label-meta">Proposal · OC Pantry Coordination Network</p>
          <h1 className="mt-4 max-w-[18ch]">{SITE.hero.headline}</h1>
          <p className="mt-5 text-[17px] text-[var(--color-ink-muted)] max-w-[52ch]">
            {SITE.hero.subline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={SITE.hero.primaryCta.href}
              className="inline-flex items-center rounded-md px-5 py-3 bg-[var(--color-brand-primary)] text-white font-semibold hover:bg-[var(--color-brand-primary-dark)] transition-colors"
            >
              {SITE.hero.primaryCta.label}
            </Link>
            <Link
              href={SITE.hero.secondaryCta.href}
              className="inline-flex items-center rounded-md px-5 py-3 border border-[var(--color-rule)] text-[var(--color-ink)] font-semibold hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] transition-colors"
            >
              {SITE.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <div>
          <InteractiveMap />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Hero.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 5: Visual check**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected:
- Hero renders with H1 on left, map on right (md+) or stacked (sm)
- Teal "Read the proposal" primary CTA, bordered "How it works" secondary
- Map bounded to Anaheim with chips
- Responsive at 375px: stack vertical, map renders full width
- Keyboard: Tab through CTAs, focus ring visible
- Ctrl+C

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Hero section with headline, subline, CTAs, and interactive map"
```

---

### Task 12: Problem section

**Files:**
- Modify: `components/site/Problem.tsx`
- Create: `tests/components/Problem.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Problem.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Problem } from '@/components/site/Problem';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<Problem />', () => {
  it('renders the section label and heading', () => {
    render(<Problem />);
    expect(screen.getByText(/the problem/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /food-rescue system that cannot see itself/i }),
    ).toBeInTheDocument();
  });

  it('anchors the Saturday-morning micro-story', () => {
    render(<Problem />);
    expect(screen.getByText(/saturday morning/i)).toBeInTheDocument();
    expect(screen.getByText(/three church pantries/i)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<Problem />);
    const text = container.textContent ?? '';
    expect(findSlopPhrases(text)).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify test fails**

```bash
pnpm test tests/components/Problem.test.tsx
```

Expected: fails (NotReady stub).

- [ ] **Step 3: Implement `components/site/Problem.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function Problem() {
  return (
    <section id="problem" className="border-b border-[var(--color-rule)] bg-[var(--color-surface-muted)]">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <p className="label-meta">{SITE.problem.sectionLabel}</p>
        <h2 className="mt-4">{SITE.problem.heading}</h2>
        <p className="mt-6 text-[17px] text-[var(--color-ink)] leading-[1.7]">
          {SITE.problem.body}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Problem.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check in dev**

Run `pnpm dev`, scroll to Problem. Expected: muted-background section, compact reading width, heading + single body paragraph, no em dashes visible. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Problem section — Saturday-morning Anaheim micro-story"
```

---

### Task 13: Picture section (Strategic Planner lead)

**Files:**
- Modify: `components/site/Picture.tsx`
- Create: `tests/components/Picture.test.tsx`

This is the site's lead narrative. Anchor section.

- [ ] **Step 1: Write failing test**

Create `tests/components/Picture.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Picture } from '@/components/site/Picture';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<Picture />', () => {
  it('renders label, heading, and Victoria anchor', () => {
    render(<Picture />);
    expect(screen.getByText(/the picture/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /one shared picture/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sunday night/i)).toBeInTheDocument();
    expect(screen.getByText(/victoria/i)).toBeInTheDocument();
  });

  it('renders the three planner callouts', () => {
    render(<Picture />);
    expect(screen.getByText(/heat map/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly ai brief/i)).toBeInTheDocument();
    expect(screen.getByText(/scenario tool/i)).toBeInTheDocument();
  });

  it('has an id of "picture" on the section element for anchor linking', () => {
    const { container } = render(<Picture />);
    expect(container.querySelector('section#picture')).not.toBeNull();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<Picture />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/Picture.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/Picture.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function Picture() {
  return (
    <section id="picture" className="border-b border-[var(--color-rule)]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <p className="label-meta">{SITE.picture.sectionLabel}</p>
        <h2 className="mt-4 max-w-[22ch]">{SITE.picture.heading}</h2>
        <p className="mt-6 text-[17px] leading-[1.7] max-w-[70ch]">
          {SITE.picture.body}
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 border-t border-[var(--color-rule)] pt-8">
          {SITE.picture.callouts.map((c) => (
            <li
              key={c.label}
              className="border-l-2 border-[var(--color-brand-primary)] pl-4"
            >
              <p className="label-meta text-[var(--color-brand-primary)]">
                {c.label}
              </p>
              <p className="mt-1 text-[14px] text-[var(--color-ink)] leading-[1.5]">
                {c.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Picture.test.tsx
```

Expected: 4 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to Picture. Expected: generous padding, H2 with narrow measure, body paragraph, three left-bordered callouts in a 3-column grid (md+) stacking on mobile. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Picture section — Strategic Planner view lead narrative"
```

---

### Task 14: Coordination section (conversational pantry loop)

**Files:**
- Modify: `components/site/Coordination.tsx`
- Create: `tests/components/Coordination.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Coordination.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Coordination } from '@/components/site/Coordination';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<Coordination />', () => {
  it('renders the anchor id, label, and heading', () => {
    const { container } = render(<Coordination />);
    expect(container.querySelector('section#coordination')).not.toBeNull();
    expect(screen.getByText(/coordination without a login/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /pantries stay in their inbox/i }),
    ).toBeInTheDocument();
  });

  it('renders the full text-message exchange', () => {
    render(<Coordination />);
    expect(screen.getByText(/any updates for st\. mark/i)).toBeInTheDocument();
    expect(screen.getByText(/tuesday same, 80 bags/i)).toBeInTheDocument();
    expect(screen.getByText(/reply change if wrong/i)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<Coordination />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/Coordination.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/Coordination.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function Coordination() {
  return (
    <section id="coordination" className="border-b border-[var(--color-rule)] bg-[var(--color-surface-muted)]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
        <div>
          <p className="label-meta">{SITE.coordination.sectionLabel}</p>
          <h2 className="mt-4 max-w-[18ch]">{SITE.coordination.heading}</h2>
          <p className="mt-6 text-[17px] leading-[1.7]">
            {SITE.coordination.body}
          </p>
        </div>
        <div
          className="rounded-xl border border-[var(--color-rule)] bg-white p-5 shadow-sm"
          role="figure"
          aria-label="Representative text exchange between the platform and a pantry operator"
        >
          <p className="label-meta">Sample exchange · representative</p>
          <ol className="mt-4 space-y-3">
            {SITE.coordination.sampleExchange.map((m, i) => {
              const fromOperator = m.from === 'operator';
              return (
                <li
                  key={i}
                  className={[
                    'max-w-[92%] rounded-2xl px-4 py-2.5 text-[14px] leading-[1.45]',
                    fromOperator
                      ? 'ml-auto bg-[var(--color-brand-primary)] text-white rounded-br-sm'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-ink)] rounded-bl-sm',
                  ].join(' ')}
                >
                  {m.text}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Coordination.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to Coordination. Expected: muted bg, copy on left (md+), iMessage-style bubbles on right, operator messages teal-filled right-aligned, system messages neutral-filled left-aligned. Stacks on mobile. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Coordination section — conversational pantry loop with sample SMS exchange"
```

---

### Task 15: LiveState section (Abound console)

**Files:**
- Modify: `components/site/LiveState.tsx`
- Create: `tests/components/LiveState.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/LiveState.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveState } from '@/components/site/LiveState';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<LiveState />', () => {
  it('renders label and heading', () => {
    render(<LiveState />);
    expect(screen.getByText(/the live state/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /abound opens one console every morning/i }),
    ).toBeInTheDocument();
  });

  it('labels the three console columns', () => {
    render(<LiveState />);
    expect(screen.getByText(/supply pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/distribution calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/routing queue/i)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<LiveState />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/LiveState.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/LiveState.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function LiveState() {
  return (
    <section id="live-state" className="border-b border-[var(--color-rule)]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <p className="label-meta">{SITE.liveState.sectionLabel}</p>
        <h2 className="mt-4 max-w-[22ch]">{SITE.liveState.heading}</h2>
        <p className="mt-6 text-[17px] leading-[1.7] max-w-[70ch]">
          {SITE.liveState.body}
        </p>

        {/* Console mock: three labeled columns. Representative, not a real screenshot. */}
        <div
          className="mt-10 rounded-xl border border-[var(--color-rule)] bg-white p-4 md:p-6 shadow-sm"
          role="figure"
          aria-label="Representative Abound console layout showing supply pipeline, distribution calendar, and routing queue"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-rule)]">
            <p className="label-meta">Abound console · representative</p>
            <p className="label-meta">Tue Apr 28 · 7:42 am</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <ConsoleColumn
              title="Supply pipeline"
              items={[
                { label: 'Ralphs Brea · 4:00 pm', detail: '~300 lb mix cold+dry' },
                { label: '99 Cents Anaheim · 2:00 pm', detail: '~200 lb dry' },
                { label: 'Corporate drive · Thu', detail: '~500 lb mix' },
              ]}
              accent="primary"
            />
            <ConsoleColumn
              title="Distribution calendar"
              items={[
                { label: 'St. Mark\'s · Tue 4-6pm', detail: 'Partial · 150 lb cold open' },
                { label: 'Faith Lutheran · Tue 5pm', detail: 'Open · needs dry' },
                { label: 'Anaheim FRC · Wed 10am', detail: 'Open · choice market' },
              ]}
              accent="primary"
            />
            <ConsoleColumn
              title="Routing queue (AI suggested)"
              items={[
                { label: 'Ralphs → St. Mark\'s Tue 4pm', detail: 'Storage + timing fit' },
                { label: '99 Cents → Faith Lutheran Tue 5pm', detail: 'Covers dry gap' },
                { label: 'Thu drive → 3 options', detail: 'Pending Mike review' },
              ]}
              accent="gold"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ConsoleColumnItem {
  label: string;
  detail: string;
}

function ConsoleColumn({
  title,
  items,
  accent,
}: {
  title: string;
  items: ConsoleColumnItem[];
  accent: 'primary' | 'gold';
}) {
  const borderVar =
    accent === 'gold'
      ? 'var(--color-brand-gold)'
      : 'var(--color-brand-primary)';
  return (
    <div>
      <p
        className="label-meta pb-2 border-b-2"
        style={{ borderColor: borderVar, color: borderVar }}
      >
        {title}
      </p>
      <ul className="mt-3 space-y-3">
        {items.map((it) => (
          <li key={it.label} className="text-[13px]">
            <p className="font-semibold text-[var(--color-ink-heading)]">
              {it.label}
            </p>
            <p className="text-[var(--color-ink-muted)]">{it.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/LiveState.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to LiveState. Expected: three-column representative console, supply/calendar in teal, routing queue in gold. Stacks vertically on mobile. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): LiveState section with representative three-column console mock"
```

---

### Task 16: CaseManager section

**Files:**
- Modify: `components/site/CaseManager.tsx`
- Create: `tests/components/CaseManager.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/CaseManager.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseManager } from '@/components/site/CaseManager';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<CaseManager />', () => {
  it('renders label + heading', () => {
    render(<CaseManager />);
    expect(screen.getByText(/a door for every family/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /under a minute/i }),
    ).toBeInTheDocument();
  });

  it('renders the worked search query', () => {
    render(<CaseManager />);
    expect(screen.getByText(/walkable from 92804/i)).toBeInTheDocument();
    expect(screen.getByText(/spanish-speaking/i)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<CaseManager />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/CaseManager.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/CaseManager.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function CaseManager() {
  return (
    <section id="case-manager" className="border-b border-[var(--color-rule)] bg-[var(--color-surface-muted)]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[1fr_1fr] md:items-start">
        <div>
          <p className="label-meta">{SITE.caseManager.sectionLabel}</p>
          <h2 className="mt-4 max-w-[20ch]">{SITE.caseManager.heading}</h2>
          <p className="mt-6 text-[17px] leading-[1.7]">
            {SITE.caseManager.body}
          </p>
        </div>
        <div
          role="figure"
          aria-label="Representative case-manager search with a natural-language query and ranked results"
          className="rounded-xl border border-[var(--color-rule)] bg-white p-5 shadow-sm"
        >
          <p className="label-meta">Search · representative</p>
          <div className="mt-3 rounded-md border border-[var(--color-rule)] p-3 font-mono text-[13px] leading-[1.45] text-[var(--color-ink)]">
            walkable from 92804, open today, Spanish-speaking, no appointment, kid-friendly
          </div>
          <ol className="mt-4 space-y-3">
            {[
              {
                name: 'Iglesia de Fe Despensa',
                meta: '0.4 mi walk · opens in 2 hr · choice · Spanish-speaking volunteer · dry in stock',
              },
              {
                name: 'St. Mark\'s Community Pantry',
                meta: '0.8 mi walk · opens Tue 4pm · choice · cold storage available',
              },
              {
                name: 'Anaheim FRC',
                meta: '1.1 mi walk · open now · choice · referrals on-site',
              },
            ].map((r, i) => (
              <li key={r.name} className="border-t border-[var(--color-rule)] pt-3">
                <p className="font-semibold text-[var(--color-ink-heading)]">
                  {i + 1}. {r.name}
                </p>
                <p className="text-[13px] text-[var(--color-ink-muted)] mt-1">
                  {r.meta}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/CaseManager.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to CaseManager. Expected: copy left, search mockup right with mono query + 3 ranked results. Stacks on mobile. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): CaseManager section with representative NL search + results"
```

---

### Task 17: PublicInfrastructure section

**Files:**
- Modify: `components/site/PublicInfrastructure.tsx`
- Create: `tests/components/PublicInfrastructure.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/PublicInfrastructure.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicInfrastructure } from '@/components/site/PublicInfrastructure';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<PublicInfrastructure />', () => {
  it('renders label + heading', () => {
    render(<PublicInfrastructure />);
    expect(screen.getByText(/public infrastructure/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /any county can fork it/i }),
    ).toBeInTheDocument();
  });

  it('renders the sample API snippet', () => {
    render(<PublicInfrastructure />);
    expect(screen.getByText(/GET \/api\/distributions/)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<PublicInfrastructure />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/PublicInfrastructure.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/PublicInfrastructure.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function PublicInfrastructure() {
  return (
    <section id="public-infrastructure" className="border-b border-[var(--color-rule)]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div>
          <p className="label-meta">{SITE.publicInfrastructure.sectionLabel}</p>
          <h2 className="mt-4 max-w-[20ch]">{SITE.publicInfrastructure.heading}</h2>
          <p className="mt-6 text-[17px] leading-[1.7]">
            {SITE.publicInfrastructure.body}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-semibold">
            <span className="rounded-full bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)] px-3 py-1">GitHub</span>
            <span className="rounded-full bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)] px-3 py-1">OpenAPI</span>
            <span className="rounded-full bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary-dark)] px-3 py-1">MIT or Apache 2.0</span>
            <span className="rounded-full bg-[var(--color-brand-gold-light)] text-[var(--color-brand-gold-dark)] px-3 py-1">Any county can fork</span>
          </div>
        </div>
        <pre
          className="rounded-xl bg-[var(--color-ink-heading)] text-white p-5 overflow-x-auto text-[12.5px] leading-[1.55]"
          aria-label="Representative API response"
        >
          <code>{SITE.publicInfrastructure.codeSample}</code>
        </pre>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/PublicInfrastructure.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to PublicInfrastructure. Expected: copy + four badge pills on left, code block on right. Code block has horizontal scroll on narrow screens. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): PublicInfrastructure section with representative API sample"
```

---

### Task 18: Team section

**Files:**
- Modify: `components/site/Team.tsx`
- Create: `tests/components/Team.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Team.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Team } from '@/components/site/Team';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<Team />', () => {
  it('renders label + heading', () => {
    render(<Team />);
    expect(screen.getByText(/who is building this/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /three partners/i }),
    ).toBeInTheDocument();
  });

  it('renders three partner cards by name', () => {
    render(<Team />);
    expect(screen.getByRole('heading', { level: 3, name: /abound food care/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /a million dreams consulting/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /datawake/i })).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<Team />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/Team.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/Team.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function Team() {
  return (
    <section id="team" className="border-b border-[var(--color-rule)] bg-[var(--color-surface-muted)]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <p className="label-meta">{SITE.team.sectionLabel}</p>
        <h2 className="mt-4 max-w-[22ch]">{SITE.team.heading}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SITE.team.cards.map((c) => (
            <article
              key={c.name}
              className="rounded-xl border border-[var(--color-rule)] bg-white p-6"
            >
              <h3>{c.name}</h3>
              <p className="label-meta mt-2 text-[var(--color-brand-primary)]">{c.role}</p>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-[var(--color-ink)]">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Team.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to Team. Expected: three equal cards at md+, stacked on sm. Each card: H3 name, teal role label, body paragraph. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Team section with Abound, AMDC, Datawake partner cards"
```

---

### Task 19: Scope section

**Files:**
- Modify: `components/site/Scope.tsx`
- Create: `tests/components/Scope.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Scope.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Scope } from '@/components/site/Scope';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<Scope />', () => {
  it('renders label + heading + eight scope bullets', () => {
    render(<Scope />);
    expect(screen.getByText(/v1 scope, timeline, budget/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /first release delivers/i }),
    ).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    const scopeBullets = items.filter((el) =>
      /shared entity model|conversational pantry loop|abound console|strategic dashboard|natural-language search|progressive web app|public read apis|sanitized public/i.test(
        el.textContent ?? '',
      ),
    );
    expect(scopeBullets.length).toBeGreaterThanOrEqual(8);
  });

  it('renders budget copy with the build range', () => {
    render(<Scope />);
    expect(screen.getByText(/\$100.*200k.*build/i)).toBeInTheDocument();
    expect(screen.getByText(/\$100k.*maintenance/i)).toBeInTheDocument();
  });

  it('uses slop-free copy', () => {
    const { container } = render(<Scope />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/Scope.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/Scope.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function Scope() {
  return (
    <section id="scope" className="border-b border-[var(--color-rule)]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <p className="label-meta">{SITE.scope.sectionLabel}</p>
        <h2 className="mt-4 max-w-[22ch]">{SITE.scope.heading}</h2>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label-meta text-[var(--color-brand-primary)]">V1 scope</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-[1.55]">
              {SITE.scope.bullets.map((b) => (
                <li
                  key={b}
                  className="pl-4 border-l-2 border-[var(--color-brand-primary)]"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div>
              <p className="label-meta text-[var(--color-brand-primary)]">Timeline</p>
              <dl className="mt-3 space-y-2">
                {SITE.scope.timeline.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 border-b border-[var(--color-rule)] pb-2">
                    <dt className="text-[var(--color-ink-muted)] text-[13.5px]">{row.label}</dt>
                    <dd className="text-[13.5px] font-medium text-[var(--color-ink-heading)] text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="label-meta text-[var(--color-brand-primary)]">Budget</p>
              <div className="mt-3 space-y-1 text-[14px]">
                <p className="font-semibold text-[var(--color-ink-heading)]">{SITE.scope.budget.build}</p>
                <p className="font-semibold text-[var(--color-ink-heading)]">{SITE.scope.budget.maintenance}</p>
                <p className="text-[13px] text-[var(--color-ink-muted)] leading-[1.55] mt-2">
                  {SITE.scope.budget.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/Scope.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to Scope. Expected: scope bullet list (teal left-border) on left, timeline definition list + budget block on right. Stacks on mobile. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): Scope section with V1 bullets, timeline, budget"
```

---

### Task 20: CTA section

**Files:**
- Modify: `components/site/CTA.tsx`
- Create: `tests/components/CTA.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/CTA.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CTA } from '@/components/site/CTA';
import { findSlopPhrases } from '@/lib/slop-lint';

describe('<CTA />', () => {
  it('renders heading + body', () => {
    render(<CTA />);
    expect(
      screen.getByRole('heading', { level: 2, name: /build this together/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/for victoria/i)).toBeInTheDocument();
    expect(screen.getByText(/for mike/i)).toBeInTheDocument();
  });

  it('renders both action links with correct hrefs', () => {
    render(<CTA />);
    expect(screen.getByRole('link', { name: /email dustin/i })).toHaveAttribute(
      'href',
      'mailto:dustin@datawake.io',
    );
    expect(screen.getByRole('link', { name: /book a call/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\//),
    );
  });

  it('uses slop-free copy', () => {
    const { container } = render(<CTA />);
    expect(findSlopPhrases(container.textContent ?? '')).toEqual([]);
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
pnpm test tests/components/CTA.test.tsx
```

Expected: fails.

- [ ] **Step 3: Implement `components/site/CTA.tsx`**

```tsx
import { SITE } from '@/lib/site-data';

export function CTA() {
  return (
    <section id="cta" className="bg-[var(--color-brand-primary-dark)] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 text-center">
        <p className="label-meta" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {SITE.cta.sectionLabel}
        </p>
        <h2 className="mt-4 text-white max-w-[22ch] mx-auto" style={{ color: 'white' }}>
          {SITE.cta.heading}
        </h2>
        <p className="mt-6 text-[17px] leading-[1.6] max-w-[52ch] mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {SITE.cta.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SITE.cta.links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              className={[
                'inline-flex items-center rounded-md px-5 py-3 font-semibold transition-colors',
                i === 0
                  ? 'bg-[var(--color-brand-gold)] text-[var(--color-ink-heading)] hover:bg-[var(--color-brand-gold-dark)] hover:text-white'
                  : 'border border-white/40 text-white hover:bg-white/10',
              ].join(' ')}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Because the h2 base color is `--color-ink-heading`, we override with inline `style={{ color: 'white' }}`. Inside the CTA the headings get an override via direct style rather than forcing a tailwind reset.

- [ ] **Step 4: Run tests**

```bash
pnpm test tests/components/CTA.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Visual check**

Run `pnpm dev`. Scroll to bottom. Expected: full-width dark teal CTA band, heading + body centered, gold primary CTA + ghost secondary CTA. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(site): CTA section with dark-teal band and gold primary CTA"
```

---

### Task 21: Header + Footer

**Files:**
- Modify: `components/site/Header.tsx`
- Modify: `components/site/Footer.tsx`
- Create: `tests/components/Header.test.tsx`
- Create: `tests/components/Footer.test.tsx`
- Copy: Datawake lockup into `public/logos/datawake-lockup.png`

- [ ] **Step 1: Copy Datawake lockup**

```bash
cp /Users/dustin/projects/dw-marketing/brand/datawake_lockup_with_robot_clear.png \
   /Users/dustin/projects/clients/prospects/Abound/Proposal/public/logos/datawake-lockup.png
```

Verify:

```bash
ls -la /Users/dustin/projects/clients/prospects/Abound/Proposal/public/logos/datawake-lockup.png
```

Expected: file present.

- [ ] **Step 2: Write failing Header test**

Create `tests/components/Header.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/site/Header';

describe('<Header />', () => {
  it('renders product name and proposal label', () => {
    render(<Header />);
    expect(screen.getByText(/oc pantry coordination/i)).toBeInTheDocument();
    expect(screen.getByText(/proposal/i)).toBeInTheDocument();
  });

  it('is keyboard-reachable nav', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('nav, header')).not.toBeNull();
  });
});
```

- [ ] **Step 3: Write failing Footer test**

Create `tests/components/Footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/site/Footer';

describe('<Footer />', () => {
  it('credits Datawake and Abound', () => {
    render(<Footer />);
    expect(screen.getByText(/datawake/i)).toBeInTheDocument();
    expect(screen.getByText(/abound food care/i)).toBeInTheDocument();
  });

  it('includes the representative-data disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/representative demo data/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Verify both fail**

```bash
pnpm test tests/components/Header.test.tsx tests/components/Footer.test.tsx
```

Expected: both fail.

- [ ] **Step 5: Implement `components/site/Header.tsx`**

```tsx
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-[var(--color-rule)]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/logos/datawake-lockup.png"
            alt="Datawake"
            width={110}
            height={28}
            style={{ width: 'auto', height: 22 }}
            priority
          />
          <span className="hidden sm:inline-block h-5 w-px bg-[var(--color-rule)]" aria-hidden />
          <span className="hidden sm:inline-block text-[13px] font-semibold text-[var(--color-ink-heading)] truncate">
            OC Pantry Coordination
          </span>
          <span className="label-meta">Proposal</span>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[var(--color-ink-muted)]">
          <a href="#picture" className="hover:text-[var(--color-brand-primary)]">The picture</a>
          <a href="#coordination" className="hover:text-[var(--color-brand-primary)]">How it works</a>
          <a href="#scope" className="hover:text-[var(--color-brand-primary)]">Scope</a>
          <a href="#cta" className="hover:text-[var(--color-brand-primary)]">Contact</a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Implement `components/site/Footer.tsx`**

```tsx
import { DATA_DISCLAIMER } from '@/lib/map-data';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-rule)] py-10 text-[13px] text-[var(--color-ink-muted)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>
          Built with <strong className="text-[var(--color-ink-heading)]">Abound Food Care</strong>{' '}
          by <strong className="text-[var(--color-ink-heading)]">Datawake</strong>. © {year}.
        </p>
        <p>{DATA_DISCLAIMER}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Run tests**

```bash
pnpm test tests/components/Header.test.tsx tests/components/Footer.test.tsx
```

Expected: all pass.

- [ ] **Step 8: Visual check**

Run `pnpm dev`. Expected: sticky translucent header with Datawake lockup + "OC Pantry Coordination" + "Proposal" label, nav on md+; footer with credits + disclaimer. Ctrl+C.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(site): Header with Datawake lockup, nav, and Footer with credits"
```

---

## Phase 4 — Polish and ship

### Task 22: Page-level accessibility audit

**Files:**
- Create: `tests/a11y/page.a11y.test.tsx`

- [ ] **Step 1: Write axe-core assertion for the full page**

Create `tests/a11y/page.a11y.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(), off: vi.fn(), remove: vi.fn(),
      addSource: vi.fn(), addLayer: vi.fn(),
      getSource: vi.fn(() => ({ setData: vi.fn() })),
      setFilter: vi.fn(), setMaxBounds: vi.fn(), fitBounds: vi.fn(),
      addControl: vi.fn(), getCanvas: vi.fn(() => ({ style: {} })),
    })),
    NavigationControl: vi.fn(),
    Popup: vi.fn(),
  },
}));

import Page from '@/app/page';

describe('page accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Page />);
    const results = await axe(container, {
      // maplibre renders inside a mocked region; disable color-contrast
      // rule only if it trips on background CSS variables in jsdom.
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run a11y test**

```bash
pnpm test tests/a11y/page.a11y.test.tsx
```

Expected: passes. If it fails, axe lists specific violations — fix each in the relevant component file and re-run.

- [ ] **Step 3: Manual responsive check at 375px**

```bash
pnpm dev
```

Open Chrome DevTools, switch to 375px iPhone SE viewport. Scroll top to bottom. Verify:
- Header nav collapses (nav items are hidden on md-)
- Hero stacks vertically, map fills width, chips wrap
- Problem section paragraph reads comfortably
- Picture callouts stack vertically
- Coordination copy and SMS bubbles stack
- LiveState three columns stack
- CaseManager stacks
- PublicInfrastructure stacks, code block horizontal-scrolls
- Team cards stack
- Scope bullets + timeline stack
- CTA heading wraps gracefully
- Footer stacks

Note any issues in a scratch file and fix inline. Ctrl+C.

- [ ] **Step 4: Manual keyboard check**

Tab from the top of the page to the bottom. Every CTA and chip receives a visible teal focus ring. No tab traps.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test(a11y): axe-core page-level check + manual 375px responsive audit"
```

---

### Task 23: Full test run + production build

**Files:**
- None (verification only)

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass across unit, components, and a11y.

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Run lint**

```bash
pnpm lint
```

Expected: 0 errors.

- [ ] **Step 4: Production build**

```bash
pnpm build
```

Expected: Next.js builds cleanly. Note the static bundle sizes; map-heavy pages may be ~300KB gzipped for the MapLibre runtime — acceptable.

- [ ] **Step 5: Production start smoke test**

```bash
pnpm start
```

Open `http://localhost:3000`. Walk the full page once. Ctrl+C.

- [ ] **Step 6: Commit if anything changed**

If any lint/typecheck fixes were needed:

```bash
git add -A
git commit -m "chore: lint + typecheck pass; production build verified"
```

---

### Task 24: Deploy to Vercel

**Files:**
- Create: `.vercel/project.json` (auto-generated by `vercel` CLI)

- [ ] **Step 1: Install Vercel CLI if not already installed**

```bash
which vercel || pnpm add -g vercel
```

Expected: CLI available.

- [ ] **Step 2: Link project**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
vercel link
```

Prompts:
- Link to existing project? No
- Scope: Datawake (default)
- Link to existing: No
- Project name: `abound-pantry-proposal`
- Modify settings: No (accepts Next.js defaults)

Expected: `.vercel/project.json` created.

- [ ] **Step 3: Deploy a preview**

```bash
vercel
```

Expected: builds and deploys. Preview URL printed (e.g., `https://abound-pantry-proposal-xxx.vercel.app`).

- [ ] **Step 4: Open the preview URL and walk every section**

Check on desktop. Then open in Safari on iPhone via the same URL. Ctrl+C.

- [ ] **Step 5: Promote to production**

```bash
vercel --prod
```

Expected: production URL printed (e.g., `https://abound-pantry-proposal.vercel.app`).

- [ ] **Step 6: Commit `.vercel/project.json`**

Note: `.vercel/` is already in `.gitignore`. Do NOT commit it. Vercel links are machine-local.

---

### Task 25: Update email draft + memory + changelog

**Files:**
- Modify: Gmail draft thread `19db594d4df80906`
- Modify: `/Users/dustin/.claude/projects/-Users-dustin-projects-clients/memory/project_abound_feed_oc.md`
- Create: `docs/CHANGELOG.md` inside the Proposal project

- [ ] **Step 1: Draft the updated Gmail body**

The existing draft links to the two Google Doc 2-pagers. Replace with a lead link to the deployed Vercel URL, keep the 2-pagers as secondary PDFs.

Use the `mcp__google-workspace__draft_email` (update) tool or the AgentMail `update_message` tool — whichever is wired to Dustin's Gmail — to modify the draft with new body. Body skeleton (HTML per Dustin's email conventions; no em dashes, no banned phrases):

```html
<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.5;">
  <p>Hi Victoria,</p>

  <p>Great chatting yesterday. I put together a proposal page that lays out the pantry coordination concept as a real product, not a flyer. Before anything goes to Mike or the Abound team, I'd love your eyes on it. A few open questions came up while drafting.</p>

  <p><strong>Proposal page (review first):</strong>
    <br><a href="[DEPLOYED_URL]" style="color:#0C7C8A;text-decoration:none;">[DEPLOYED_URL]</a>
  </p>

  <p><strong>The 2-pagers are now archival</strong> and linked here only for completeness:
    <a href="https://docs.google.com/document/d/1aXvdYmqOaUPL8WVI0qdastMGvqHEPeMNXxKS0dxSOnU/edit" style="color:#0C7C8A;">v1 (text)</a>,
    <a href="https://docs.google.com/document/d/1tSVScEgAd7nzZNnChGYhAqmirBSP0vKPLDrZG4c3qhQ/edit" style="color:#0C7C8A;">v2 (designed)</a>.
  </p>

  <!-- ... remaining 8 open questions preserved from original draft ... -->

  <p>Best,<br>Dustin</p>
</div>
```

Replace `[DEPLOYED_URL]` with the production URL from Task 24.

- [ ] **Step 2: Update the Gmail draft via tooling**

Use the appropriate Google Workspace tool to update draft `19db594d4df80906` with the new HTML body. Exact command depends on which tool is available at execution time — if no update-draft tool exists, delete the existing draft and create a new one with the same recipient, subject, and thread association.

- [ ] **Step 3: Update memory file**

Read `/Users/dustin/.claude/projects/-Users-dustin-projects-clients/memory/project_abound_feed_oc.md`. Add to the Artifacts list:

```markdown
- Deployed proposal site: [DEPLOYED_URL] (primary external artifact as of 2026-04-22; 2-pagers are now archival)
```

Update the Status line:

```markdown
**Status (2026-04-22):** Proposal site built and deployed at [DEPLOYED_URL]. 2-pagers archived as secondary. Victoria review pending. Mike call May 5 at 9am PT. Grant submission May 15.
```

Also correct the earlier incorrect memory claim that `clients/prospects` is a symlink. Remove or correct the relevant line if still present.

- [ ] **Step 4: Create a CHANGELOG.md inside the Proposal repo**

Create `/Users/dustin/projects/clients/prospects/Abound/Proposal/docs/CHANGELOG.md`:

```markdown
# Changelog

## 2026-04-22 — v1 proposal site

- Initial deployment at [DEPLOYED_URL]
- 10 sections: Hero, Problem, Picture (lead), Coordination, LiveState, CaseManager, PublicInfrastructure, Team, Scope, CTA
- Interactive Anaheim map with 20 representative distribution features and 5 filter chips
- Five AI pillars documented in copy
- Data-forward design direction applied
- Full test suite: unit + component + a11y (axe-core)
- AI-slop lint enforces zero banned phrases and zero em-dash clause separators in user-facing copy
```

- [ ] **Step 5: Commit**

```bash
cd /Users/dustin/projects/clients/prospects/Abound/Proposal
git add -A
git commit -m "docs: CHANGELOG, initial v1 proposal site deployed"
```

---

## Self-Review

**1. Spec coverage check:**

- Hero (spec 4.2): Task 11 ✅
- Site structure 10 sections (spec 4.3): Tasks 11–20 ✅
- Per-section copy shape (spec 4.4): draft copy in Task 10 site-data, refined in section tasks ✅
- Design direction C (spec 4.5): globals.css tokens (Task 3), visual pass in section components ✅
- Visual system (spec 4.6): Task 3 ✅
- Interactive map with filter chips and tooltip (spec 4.7 + 5.3): Tasks 7–9 ✅
- Accessibility (spec 4.8): Task 22 ✅
- Repo + Drive symlink (spec 5.1): Tasks 1 + 6 ✅
- Tech stack (spec 5.2): Task 1 ✅
- Map data approach (spec 5.3): Task 7 ✅
- Deploy (spec 5.5): Task 24 ✅
- Anti-AI-slop checklist (spec 4.5): enforced via Task 10 lint + per-section tests ✅
- Five AI pillars (spec 3.5): covered in site-data copy (Task 10) and Picture/Coordination/LiveState/CaseManager sections ✅
- Responsive 375px (spec 4.8): Task 22 step 3 ✅

**2. Placeholder scan:** ran grep manually during drafting. No "TBD", "TODO", "implement later", "add appropriate error handling", etc. in implementation steps. Every step shows real code or a real command.

**3. Type consistency:** `FilterState` shape defined in Task 8 matches usage in Tasks 9 and FilterChips. `DistributionFeatureProperties` defined in Task 7 matches usage in MapTooltip (Task 9) and the GeoJSON file. `SITE` shape defined in Task 10 matches component imports in Tasks 11–20.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-proposal-site-implementation.md`.

Two execution options:

**1. Subagent-Driven (recommended).** I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution.** Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Which approach?
