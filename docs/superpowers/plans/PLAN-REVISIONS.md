# Plan v2 revisions (Codex review + design-session integration)

> **Status:** tracking doc. Consolidates every fix to apply when we rewrite `2026-04-22-proposal-site-implementation.md` into v2 after the design session produces `DESIGN.md`.

---

## Reviewer
- **Codex** (GPT-5.4 via `codex exec`), run 2026-04-22, output at `/tmp/codex-plan-review-v3.md`
- Verified legitimacy: verbatim Task 3 quote ("Design tokens encode the Datawake brand…") confirms Codex read the real plan, not a hallucinated one.
- Earlier runs (v1, v2) hallucinated a different project's plan and were discarded.

## Applied already (interim surgical fixes, before v2 rewrite)
- **Task 5 `package.json` `lint` script:** `"next lint"` → `"eslint . --max-warnings=0"`. Next.js 16 removed the `next lint` command.

## Critical fixes to apply in v2 (must-fix before execution)

### Task 4 — root layout
- Remove `themeColor` from `metadata` export.
- Add a separate `viewport` export:

```ts
export const viewport: Viewport = {
  themeColor: '#0C7C8A',
};
```

Official ref: [Next.js `generateViewport`](https://nextjs.org/docs/app/api-reference/functions/generate-viewport).

### Task 7 — GeoJSON import strategy
- TypeScript's `resolveJsonModule` covers `.json`, not `.geojson`. Two options:
  - **Option A (preferred):** keep `.geojson` extension; in tests, read via `fs.readFileSync` and `JSON.parse`. No TypeScript import trickery.
  - **Option B:** rename the file to `anaheim-distributions.json`. Cleaner TS import, but loses semantic extension recognition in editors.
- Recommend Option A. Update the test to:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DistributionFeatureCollection } from '@/lib/map-data';

const fc = JSON.parse(
  readFileSync(join(process.cwd(), 'public/data/anaheim-distributions.geojson'), 'utf-8'),
) as DistributionFeatureCollection;
```

- Remove the `"public/**/*.geojson"` include from `tsconfig.json`.

### Task 9 — InteractiveMap data flow + interaction + a11y
- **Invert data flow.** Parent Server Component loads the GeoJSON once at render time (via `fs.readFileSync` in the page) and passes it to the client `InteractiveMap` as a typed prop. No client-side `fetch`. This removes the waterfall and makes tests deterministic (no fetch mock needed).

```tsx
// app/page.tsx (or wherever Hero is composed)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DistributionFeatureCollection } from '@/lib/map-data';

const distributions = JSON.parse(
  readFileSync(join(process.cwd(), 'public/data/anaheim-distributions.geojson'), 'utf-8'),
) as DistributionFeatureCollection;

// pass as prop: <Hero distributions={distributions} />
```

- **Hover, not click.** Change popup trigger from `click` to `mouseenter` with `mouseleave` cleanup. Keep click for touch devices via a capability check, or make both work.
- **Keyboard accessibility.** Canvas dots are not keyboard-reachable. Add a visually-hidden (or visible-on-focus) `<ul>` list of distributions below the map, linked to the same data source, each item is a focusable button that triggers the same tooltip state. The spec's 4.8 accessibility section requires "Map alternate: every section with a map has a text summary of what the map shows."
- **Textual map summary.** Add a concise `<p>` above or below the map summarizing what it shows ("Representative distribution sites in Anaheim. Filter by capability. Three sites flagged as overlapping on Saturday 9am in central Anaheim."). This satisfies spec 4.8.

### Task 22 — real color-contrast check
- Do NOT disable `color-contrast` in axe. The spec's 4.8 explicitly requires WCAG AA contrast for teal/gold combinations.
- If the axe + jsdom integration produces false positives because CSS variables are not resolved in jsdom, switch to a headless-browser audit (Playwright + axe-core) OR a static contrast-ratio test:

```ts
// Option: unit-test the design tokens themselves
import { getContrastRatio } from '@/lib/contrast';
test('teal on white meets WCAG AA for body text', () => {
  expect(getContrastRatio('#0C7C8A', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
});
test('gold on white meets AA for large text', () => {
  expect(getContrastRatio('#D4A843', '#FFFFFF')).toBeGreaterThanOrEqual(3);
});
```

- Implement a small `lib/contrast.ts` with the WCAG contrast ratio formula.

### Task 10 — scrub unsourced numbers from SITE copy
Every one of these needs to be either removed, replaced with a verifiable citation, or explicitly labeled representative:

| Current | Fix |
|---|---|
| "tens of millions of pounds" (Problem) | Drop entirely or cite Abound's annual report number + link |
| "32 percent" projected coverage lift (Picture) | Tag as "(representative projection)" inline |
| "300-plus pantry volunteers" (Coordination) | Drop specific count; say "hundreds of operators" or cite a source |
| "0.6-mile walk" (CaseManager worked example) | Keep only if the demo map has a real distance; otherwise "a short walk" or tag as representative |
| "served 72 families" (Coordination) | Already clearly representative; keep but consider adding a tiny "(example)" tag |
| "$100–200K build" (Scope) | Sourced — it's the 2-pager budget figure |

Add a standing rule to `SITE`: any quantitative claim not sourced is either dropped, made qualitative, or tagged `(representative)`.

## Bite-size task splits (per Dustin's directive: context-clearing chunks)

Each split preserves all steps of the original task but distributes them across focused sub-tasks that a fresh subagent can own end-to-end.

### Task 1 → 1a + 1b
- **1a. Scaffold Next.js 16.** `git init` (guarded: skip if `.git` exists), `pnpm create next-app`, verify dev server, update `.gitignore`. Remove the mandatory Context7 step; the subagent can invoke Context7 optionally if stuck but the plan does not depend on it.
- **1b. Install runtime + dev dependencies.** MapLibre, Framer Motion (only if we keep it), Vitest, RTL, jest-axe, prettier. Install in one shot; verify `pnpm install` clean; commit.

### Task 9 → 9a + 9b + 9c
- **9a. `components/map/FilterChips.tsx`** (pure UI + types). Render chips from `FilterState`. Test: renders all chips, aria-pressed toggles on click.
- **9b. `components/map/MapTooltip.tsx`** (pure presentation). Render feature properties. Test: renders name, type, next distribution, storage badges, conditional overlap label.
- **9c. `components/map/InteractiveMap.tsx`** (MapLibre integration). Receives typed `DistributionFeatureCollection` as prop (not via fetch). Hover popup. Keyboard-accessible list below map. Textual summary. Test: renders disclaimer + map region; filter state integration mocked.

### Task 10 → 10a + 10b + 10c
- **10a. Slop lint.** `lib/slop-lint.ts` + `tests/unit/slop-lint.test.ts`. Standalone.
- **10b. `lib/site-data.ts`** (SITE constants, post-scrub). Includes the scrubbed copy per the table above. Includes `tests/unit/site-copy-lint.test.ts` that runs slop-lint over every string in SITE.
- **10c. Page skeleton.** `app/page.tsx` + section stubs via `NotReady`. Just the assembly, no copy.

### Task 25 → 25a + 25b + 25c
- **25a. Update Gmail draft** (swap 2-pager link for deployed URL). Include fallback: if the Google Workspace MCP update-draft path is unavailable, delete + re-create the draft with the same thread association. Explicit prerequisite check.
- **25b. Update memory file.** `/Users/dustin/.claude/projects/-Users-dustin-projects-clients/memory/project_abound_feed_oc.md`. Fix the incorrect "symlink" claim at the same time.
- **25c. Write CHANGELOG.md** inside the Proposal repo. Commit.

## New tasks to insert

### Task 5b (after scaffold, before sections) — ESLint config
Since Next.js 16 removed `next lint`, set up ESLint directly:
- Install `eslint`, `eslint-config-next`, `typescript-eslint`, relevant plugins
- Create `eslint.config.mjs` with the flat config format
- Verify `pnpm lint` runs clean

### Task 6b (can replace/fold Task 6) — Drive symlink (optional, gated)
Mark the symlink task as OPTIONAL with a precondition check: skip if Drive folder is unreachable. It's a nice-to-have for Dustin's navigation, not a shipping requirement.

### Task 23b — Lighthouse performance audit on Vercel preview
Spec 4.1 says "work in under 3 seconds on a typical mobile connection." Current Task 23 only checks build success. Add:
- Deploy preview
- Run `pnpm dlx lighthouse <preview-url> --preset=perf --form-factor=mobile --throttling.cpuSlowdownMultiplier=4 --output=json --output-path=./lighthouse.json`
- Parse LCP, TTI, CLS, INP; assert LCP < 2.5s, CLS < 0.1, INP < 200ms, total-blocking-time < 300ms
- Fail the task if thresholds not met; investigate (common culprits: MapLibre bundle, font loading, hero layout shift)

### Task 24 prerequisites (insert at top of Task 24)
- Verify `vercel` CLI is on PATH. If not, `pnpm add -g vercel`.
- Verify `vercel whoami` resolves. If not, prompt user to run `vercel login` in a separate terminal.
- Capture the Datawake team scope id before `vercel link` so the link doesn't default to a personal scope.
- After deploy, capture preview URL into `.vercel-preview-url` (gitignored) so Task 25a can read it.

## Structural cleanup

### Remove `git checkout app/page.tsx` hack in Task 9
Per Codex: dangerous in a dirty-tree subagent workflow. Replacement: in Task 9c's visual-check step, render the map in a dedicated route (`app/_preview/map/page.tsx`) for local verification; delete that file at the end of the step; no touching `app/page.tsx`.

### `robots.ts` / `sitemap.ts` in file structure
Currently listed in the target file structure (line 39) but no task creates them. Two options:
- Remove from file structure (site doesn't strictly need them for a single-URL proposal)
- Add a small task (Task 5c) that creates both with sensible defaults

Recommended: small task to add them. The site is public-facing and linked from an email; Google is going to crawl it.

### shadcn/Framer Motion — decide or remove
- Codex: installed but barely used; architecture theater.
- Design session will decide which primitives are actually used. Install those; drop others.
- If `Tooltip` from shadcn is kept, add `<TooltipProvider>` at the root layout level.

### Datawake team card copy
Current: "Production-grade open-source codebase on modern tooling: Next.js, Vercel, Postgres, AI SDK." Reads as vendor marketing.
Replacement (flatter, operational, grant-facing):
> "Software consultancy building the system. Long-term maintenance included. Open-source codebase maintained on GitHub."

No stack name-dropping in the card. The tech choices belong in an appendix or not at all.

## Test ceremony reduction (applies to Tasks 11–21)

Codex: section tests that assert exact headline strings create churn during copy refinement. After design session locks copy, reduce section tests to:
- Structural anchor (`section#<id>` present)
- Accessibility landmarks / heading hierarchy
- Interaction (if any; e.g., filter chips, link hrefs)
- Slop lint already runs site-wide in the page-level test

Drop per-section string assertions. The site-copy-lint test already guarantees the copy is clean; that's the meaningful coverage.

## Deferred to design session (post-DESIGN.md)

These items are not fixed in the interim; they will be addressed when section tasks are rewritten to reference `DESIGN.md`:

- **Problem section:** inline map cutout showing the Lincoln Ave overlap
- **Picture section:** lead visual beyond three callouts (heat map sketch, scenario tool preview, or equivalent)
- **LiveState:** honest mock vs screenshot decision; if mock, acknowledge as placeholder for future real screenshot
- **CaseManager:** same treatment as LiveState
- **Team:** portraits (or logos, if portraits unavailable) for each of the three partners
- **Header:** Abound lockup alongside Datawake lockup? Design session decides co-branding treatment

## Order of operations

1. Apply interim Task 5 `lint` fix ✅
2. This tracking doc ✅
3. **Design session** → produce `DESIGN.md` (next)
4. Plan v2 rewrite (integrates all above + `DESIGN.md`)
5. Plan v2 cross-AI review (Codex again, brief)
6. Execute v2
