# DESIGN.md — OC Pantry Coordination Network Proposal Site

**Status:** v2 — locked direction (Soft Structuralism) after 5-way side-by-side review
**Date:** 2026-04-22
**Owner:** Dustin Cole (Datawake)
**Design skills consulted:** `frontend-design`, `high-end-visual-design`, `shadcn-radix-tailwind`, `design-taste-frontend`, `stitch-design-taste`
**Direction picked from:** `.superpowers/brainstorm/48302-1776897873/content/05-soft-structuralism-direction.html`

This is a design contract. Build tasks reference specific sections ("follow DESIGN.md §4.3") rather than re-deciding. Changes require updating this doc, not inline drift.

---

## 1. Design direction

**Name:** Soft Structuralism (Linear × Vercel × Apple Pro, tuned warm)

**In one sentence:** A sophisticated modern product company building civic infrastructure: silver-warm paper, near-black ink, massive engineered Grotesk display, floating ambient-shadow cards with Double-Bezel nested architecture, and Apple-tier magnetic micro-motion on every interactive surface.

**Vibe archetype** (from `high-end-visual-design` §3A): **Soft Structuralism** — silver-grey surface, near-black ink, massive bold Grotesk typography, airy floating components with highly diffused stacked ambient shadows. Tuned one notch warmer (`#F7F6F3` not Apple's `#F5F5F7`) so the page reads sophisticated without feeling cold to a nonprofit audience.

**Layout archetype** (from `high-end-visual-design` §3B): **Editorial Split** for the hero (headline block left, interactive map right in Double-Bezel frame); **Asymmetrical Bento** for the data section (dominant table + sticky side-card summary at `grid-cols-[1fr_280px]`); **Z-Axis Cascade** reserved for the team section (3 slightly-overlapping partner cards with gentle rotation).

**Three-second payoff:** Page loads, hero staggered reveal orchestrates (eyebrow → headline → subline → CTAs → map fade-in → dots stagger → gold overlap cluster pulses). Gold caption resolves: *"SAT 9:00AM · 3 PANTRIES · 300 M"* with monospace metric framing + "The system cannot see this" in body type. Pulse runs 3 cycles then stops. Product argument delivered before the viewer has scrolled.

**Anti-goals:** Not warm editorial luxury (that's Direction 01, which we reviewed and did not pick). Not Swiss data terminal (too cold, Direction 02). Not civic publication (too restrained, Direction 03). Not broadsheet editorial (too print, Direction 04). Not SaaS marketing. Not a pitch deck. This reads as a product-caliber civic infrastructure firm.

**Audience read, by persona:**
- **Victoria (nonprofit consultant, reviews first):** "This is sophisticated and trustworthy. It doesn't feel like a startup pitch. I can send this to Mike."
- **Mike (Abound Food Care, grant author):** "These people build at a serious level — their craft shows in every radius and shadow. I believe the build quality they're claiming."
- **Grant reviewer (indirect):** "This is a real infrastructure firm doing real work. The data is front and center and legible."

---

## 2. Typography system

### 2.1 Font trinity

- **Display:** **Geist** (Google Fonts, weights 400/500/600/700). Used for hero headline, section H2s, H3 subsections, nav brand text, and CTA labels. Engineered Grotesk register — reads as "product company" when set at massive scale with tight tracking.
- **Body:** **DM Sans** (Google Fonts, Datawake brand, weights 400/500/600/700). Everything that isn't display: paragraph body, table cells, descriptions, map tooltip content, secondary card copy.
- **Mono / metadata:** **Geist Mono** (Google Fonts, weights 400/500). Used for: eyebrow tag labels, column headers in the data table, `§` section numbers, timestamps, monospace metric framing in the gold overlap caption, API code block, and the direction meta strip.

Font variables via `next/font/google` — loaded once at root, exposed as `--font-sans` (Geist), `--font-body` (DM Sans), `--font-mono` (Geist Mono). Use `display: swap` + size-adjust metrics.

**Explicit bans:** Inter, Roboto, Arial (except as fallback), Open Sans, Helvetica (except as fallback), Instrument Serif (that's Direction 01 — confuses differentiation), Fraunces (that's Direction 03), Source Serif 4 (that's Direction 04). If a serif accent is ever needed (unlikely in this direction), reach for discussion before adding.

### 2.2 Scale

Fluid via `clamp()`. Min reference 375px, max reference 1440px.

| Role | Font | Weight | Size | Line | Letter-spacing | Use |
|---|---|---|---|---|---|---|
| Display XL | Geist | 600 | `clamp(2.8rem, 5.2vw, 4.25rem)` | 1.00 | −0.04em | Hero H1 only |
| Display L | Geist | 600 | `clamp(1.9rem, 3.4vw, 2.8rem)` | 1.02 | −0.04em | Section H2s |
| Display M | Geist | 600 | `clamp(1.5rem, 2.6vw, 2rem)` | 1.10 | −0.03em | Sub-sections, scenario-tool heading |
| Display S (numbers) | Geist | 600 | `clamp(1.5rem, 2.4vw, 1.875rem)` | 1.00 | −0.025em | Standalone stats in scope/budget |
| Body L | DM Sans | 400 | `clamp(1rem, 1.1vw, 1.125rem)` | 1.58 | −0.004em | Hero subline, section prose |
| Body M | DM Sans | 400 | 1rem (16px) | 1.55 | −0.002em | Default body, prose paragraphs |
| Body S | DM Sans | 400 | 0.875rem (14px) | 1.55 | −0.002em | Table cells, card descriptions |
| Label mono | Geist Mono | 500 | 0.625rem–0.688rem (10–11px) | 1.20 | 0.14em–0.18em uppercase | Eyebrow tags, meta strip, column headers |
| Nav brand | Geist | 600 | 13px | 1.00 | −0.02em | Nav wordmark |
| Nav link | DM Sans | 500 | 13px | 1.00 | 0 | Nav anchor links |
| Button | Geist | 600 | 14px | 1.00 | −0.01em | Primary + secondary CTAs |
| Mono tag | Geist Mono | 500 | 9–10px | 1.20 | 0.16em–0.18em uppercase | Filter-chip labels, kbd hints |

### 2.3 Typographic rules

- **Emphasis technique for "Orange County" in H1:** color change to `--brand-primary` (`#0C7C8A`) — NOT italic, NOT underline, NOT bold. Color is the only emphasis vehicle in Grotesk register.
- **Italic is banned in display.** Geist italic reads wrong for this register. If italic is editorially load-bearing somewhere in body prose (rare), it's acceptable.
- **Body max measure:** 58–68ch. Hero subline `max-width: 48ch`. Section prose `max-width: 58ch`. Never full-bleed prose.
- **Tabular numerals** via `font-variant-numeric: tabular-nums` on every number in body text or table cells. Utility class `.tabular`.
- **Uppercase labels use Geist Mono with 0.14em–0.18em letter-spacing.** Never DM Sans uppercase-spaced (reads wrong in this direction; Mono is the metadata voice).
- **No generic 16px body everywhere** — use Body L for section prose, Body M for UI copy, Body S for meta/cells.

### 2.4 Hero headline treatment (verbatim)

```
Shared food-rescue data for Orange County.
```

Rendering:
- `Shared food-rescue data for ` — Geist 600, Display XL, color `--ink` (`#0A0A0B`)
- `Orange County` — Geist 600, Display XL (same size/weight), color `--brand-primary` (`#0C7C8A`)
- Trailing period in ink

Subline (DM Sans Body L, `--ink-muted`):

```
Open directory. Live distribution state. Public APIs. Built with Abound Food Care.
```

First sentence "Open directory." is DM Sans 600, `--ink`. Rest is DM Sans 400, `--ink-muted`.

---

## 3. Color system

### 3.1 Tokens (referenced by name in code, never by hex in components)

**Surfaces**

| Token | Value | Use |
|---|---|---|
| `--surface-paper` | `#F7F6F3` | Page background (silver-warm, the direction's signature — whisper of warmth against cool grey) |
| `--surface-card` | `#FFFFFF` | Card interior, table background |
| `--surface-ink` | `#0A0A0B` | CTA band on deep surfaces, code block background |
| `--surface-muted` | `#F2F1ED` | Alternating sections, input fields (a touch warmer than paper, cool-warm calibrated) |

**Brand (Datawake, unchanged)**

| Token | Value | Use |
|---|---|---|
| `--brand-primary` | `#0C7C8A` | Identity, primary CTA background, link color, hero "Orange County" accent, map dot default, filter-chip-active, eyebrow icon |
| `--brand-primary-dark` | `#085A66` | Hover/emphasis, eyebrow pill text |
| `--brand-primary-light` | `#E8F5F7` | Tint backgrounds, secondary CTA nested-icon fill |
| `--brand-gold` | `#D4A843` | Semantic flag ONLY — overlap cluster, high-need alert, CTA-band accent on deep-teal surfaces |
| `--brand-gold-dark` | `#856708` | Gold text on `--brand-gold-light` backgrounds (v2 fix: darkened from #92710A to meet WCAG AA 4.5:1) |
| `--brand-gold-light` | `#FFF8E7` | Gold callout backgrounds, map overlap caption flag fill |

**Ink / neutrals**

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0A0A0B` | Default body text, headings, primary ink — near-black, not pure black (pure `#000000` is banned per `stitch-design-taste`) |
| `--ink-heading-alt` | `#1C2D3A` | Reserve for cooler-ink emphasis where `--ink` would feel overweight — rare, document per-use |
| `--ink-muted` | `#5F6875` | Secondary text, nav links, muted meta, timestamps (v2 fix: darkened from #6B7280 to meet WCAG AA 4.5:1) |
| `--ink-faint` | `#9CA3AF` | Tertiary, disabled, empty-state placeholder |
| `--rule-cool` | `#E6E5E0` | Hairline rules across the site (cool-leaning warm, to sit on paper without yellowing) |
| `--rule-strong` | `#D7D5CE` | Card bezel outer ring, stronger dividers |

**Status (sparingly, semantic only)**

| Token | Value | Use |
|---|---|---|
| `--status-open` | `#10B981` | Capacity open indicator |
| `--status-partial` | `#D4A843` | Capacity partial (uses gold semantically) |
| `--status-full` | `#6B7280` | Capacity full (muted, not alarm) |
| `--status-closed` | `#9CA3AF` | Capacity closed (faint) |

### 3.2 Color discipline

- **Gold is semantic.** Every use of `--brand-gold` or its variants carries meaning: a flagged overlap, an alert, a callout that says "this matters." Never decorative. The only exception: the CTA band on deep-teal surface (§7.13), where gold is the call-to-action anchor because teal-on-teal would vanish — this exception is documented per-use.
- **Teal is identity + interactive.** Headline color accent, primary CTA background, link color, map dot default, filter-chip-active state, eyebrow pill icon, nav brand-mark gradient.
- **Paper over white.** The page background is `#F7F6F3`, never `#FFFFFF`. Cards interior white (`#FFFFFF`) sits on paper and breathes. The warmth whisper is sub-conscious — it prevents the cold-SaaS read.
- **Ink over black.** Primary text is `#0A0A0B`, never `#000000`. Pure black on paper creates excessive contrast harshness; the near-black has 98.5% of the contrast value while reading softer.
- **Warm-cool calibration** is the direction's signature: paper has warmth, ink is cool-leaning, rule is warm-cool split. Do not swap any token for a pure cool or pure warm neutral; the balance is the brand.
- **No dark mode in v1.** Focused scope. Grant reviewers read in meeting projectors where dark mode hurts.

### 3.3 Atmospheric gradient (hero + data section only)

A single radial teal gradient sits behind the hero and (mirrored-smaller) behind the data section. Very subtle, 4% opacity, never a visible blob.

```css
.ss-hero::before {
  content: "";
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
```

This is the *only* gradient in the entire site. Differentiates Soft Structuralism from flat Minimalism. **Not a blob. Not a mesh. Not a glow.** A single atmospheric radial per section.

### 3.4 No film grain in this direction

Film grain overlay is Editorial Luxury's move (Direction 01) and would fight the engineered Soft Structuralism register. **Do not add grain to any surface.**

### 3.5 Contrast compliance

All ink-on-surface, brand-on-surface, and gold-on-surface combinations audited against WCAG AA. `lib/contrast.ts` asserts every pair used in the site.

| Pair | Ratio | Pass |
|---|---|---|
| `--ink` (#0A0A0B) on `--surface-paper` (#F7F6F3) | 19.5:1 | AAA |
| `--ink` on `--surface-card` (#FFFFFF) | 20.1:1 | AAA |
| `--ink-muted` (#5F6875) on `--surface-paper` | 5.22:1 | AA body (fixed v2 — was #6B7280 / 4.47 below AA) |
| `--brand-primary` (#0C7C8A) on `--surface-paper` | 5.1:1 | AA body |
| `--brand-primary` on `--surface-card` | 5.3:1 | AA body |
| `--brand-gold-dark` (#856708) on `--brand-gold-light` (#FFF8E7) | 5.03:1 | AA body (fixed v2 — was #92710A / 4.32 below AA) |
| `--surface-paper` on `--brand-primary-dark` (#085A66) | 8.4:1 | AAA (CTA band inverse) |

Unit test per pair. Real WCAG math, not axe-in-jsdom.

---

## 4. Spatial system

### 4.1 Base unit

8px. All spacing multiples: `4 8 12 16 24 32 48 64 96 128 160 192`.

### 4.2 Section vertical rhythm

| Context | Desktop | Mobile |
|---|---|---|
| Page wrap | `py-24 to py-32` (96–128px) | `py-16 to py-20` (64–80px) |
| Hero | `pt-16 pb-18` (64px top, 72px bottom) | `pt-12 pb-14` (48px top, 56px bottom) |
| Major narrative section | `py-24 to py-28` (96–112px) | `py-15 to py-20` (60–80px) |
| CTA band | `py-32 to py-40` (128–160px) | `py-20 to py-24` (80–96px) |
| Eyebrow-to-H2 gap | `mt-5 to mt-6` (20–24px) | `mt-4 to mt-5` |
| H2-to-body gap | `mt-4` (16px) | `mt-4` |
| Body-to-next-element | `mt-8 to mt-9` (32–36px) | `mt-6 to mt-7` |

Generous. Section breathing is what separates product-caliber from content-farm.

### 4.3 Grid

- Max content width: `1200px` desktop, `100%` with `px-6` gutters below 1280px
- Editorial Split hero: `grid-cols-1` (mobile) → `grid-cols-[minmax(0,480px)_minmax(0,1fr)]` (md+), headline block fixed, map fills remainder, gap `64px`
- Asymmetrical Bento (data section): `grid-cols-1` (mobile, side-card hidden) → `grid-cols-[1fr_280px]` (lg+), table dominant, side-card summary fixed-width
- Partner cards (§7.12): `grid-cols-1` (mobile) → `grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]` (lg+) with slight negative-margin overlap and ±1.5deg rotation per card (Z-Axis Cascade archetype, collapsed below 768px)
- Standard narrative sections: single column, prose `max-w-[58ch]`, block visuals `max-w-[1100px]`

### 4.4 Mobile collapse

All asymmetric layouts collapse to single-column `w-full` with `px-6` below `md` (768px). Z-Axis Cascade collapses to single-column at standard spacing (rotations/overlaps removed to prevent touch-target conflicts per `high-end-visual-design` §3B).

Use `min-h-[100dvh]` (not `h-screen`) for any full-viewport section to prevent iOS Safari viewport jumping.

### 4.5 Double-Bezel radius system

Primary bezel wraps the hero map and the data table. Nested enclosure per `high-end-visual-design` §4A.

- Outer shell: `padding: 6px; border-radius: 1.75rem` (28px); bg `rgba(10,10,11,0.04)`; ring `1px solid rgba(10,10,11,0.06)`; inset top highlight `rgba(255,255,255,0.8)`
- Inner core: `border-radius: calc(1.75rem - 6px)` (22px); bg `--surface-card`; stacked ambient shadow system per §5.4

The `calc()` preserves curvature relationship. Radii are NEVER hardcoded separately.

---

## 5. Motion system

### 5.1 Philosophy

One orchestrated hero moment (pulse + caption reveal). Scroll-reveal entry animations on section headings and primary data blocks. Magnetic button-in-button hover choreography. Row hover cross-highlight to map. Nothing else moves unless user hovers, focuses, or clicks.

Never animate layout-triggering properties (`top`, `left`, `width`, `height`, `margin`). Only `transform` and `opacity` (and `filter: blur` for subtle reveals, which is also GPU-accelerated).

Per CLAUDE.md: `prefers-reduced-motion: reduce` disables pulse, scroll reveals, magnetic hovers. All content reachable without motion.

### 5.2 Easing tokens

```css
--ease-editorial: cubic-bezier(0.32, 0.72, 0, 1);      /* default, heavy finish */
--ease-gentle:    cubic-bezier(0.4, 0, 0.2, 1);        /* micro-interactions */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);   /* playful overshoot, reserve */
```

`--ease-editorial` is the default across the site. `linear` and `ease-in-out` are explicitly banned per `high-end-visual-design` §2.

### 5.3 Durations

```css
--dur-fast:   140ms;
--dur-medium: 260ms;
--dur-slow:   560ms;
--dur-hero:   800ms;
```

### 5.4 Floating ambient shadow system (site signature)

The "silver-warm paper + floating cards" signature is built on a stacked 4-layer shadow:

```css
.ss-float-card {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),       /* top highlight */
    0 2px 4px rgba(15, 20, 30, 0.04),              /* contact shadow */
    0 20px 40px -20px rgba(15, 20, 30, 0.12),      /* mid ambient */
    0 40px 80px -40px rgba(15, 20, 30, 0.08);      /* distant ambient */
}
```

Applied to: hero map Double-Bezel inner core, data table Double-Bezel inner core, side-card summary, partner cards. The 4-layer stack gives cards the "floating half an inch off the page" read that separates Soft Structuralism from flat layouts.

**Never use harsh single-layer drop shadows** (`box-shadow: 0 4px 6px rgba(0,0,0,0.3)` etc). Always the stacked-ambient system.

### 5.5 The hero reveal (orchestration)

On page load, using Motion (with `LazyMotion` + `m` components):

1. **t=0** — page visible, nothing animated yet
2. **t=100ms** — eyebrow tag: `opacity 0 → 1`, `translate-y 8px → 0`, 560ms, `--ease-editorial`
3. **t=220ms** — H1 headline: `opacity 0 → 1`, `translate-y 16px → 0`, `blur 4px → 0`, 800ms, `--ease-editorial`
4. **t=380ms** — subline: same pattern, 560ms
5. **t=500ms** — CTA buttons: stagger 40ms each, same pattern, 420ms
6. **t=600ms** — map container fades in (`opacity 0 → 1`, 700ms, `--ease-editorial`)
7. **t=1000ms** — map dots fade in staggered by neighborhood (MapLibre `circle-opacity` transition)
8. **t=1800ms** — gold overlap cluster starts pulsing (3 cycles, 2.4s each)
9. **t=1800ms** — overlap caption reveals: `[SAT 9:00AM · 3 PANTRIES · 300 M]` gold-flag pill + `"The system cannot see this."` body text
10. **t=~9000ms** — pulse completes 3 cycles, stops. Caption stays. Product argument delivered.

Implementation: Motion timeline via `useEffect` + `m.div` with explicit `initial`/`animate`/`transition` objects. Total orchestration bounded — does not repeat.

### 5.6 The pulse animation (CSS, not JS)

Two-ring animated pulse at the overlap cluster, offset by 0.6s for a breathing cascade:

```css
@keyframes ss-pulse-ring {
  0%   { r: 10; opacity: 0.7; }
  65%  { r: 28; opacity: 0; }
  100% { r: 10; opacity: 0; }
}
@keyframes ss-pulse-ring2 {
  0%   { r: 10; opacity: 0.4; }
  65%  { r: 38; opacity: 0; }
  100% { r: 10; opacity: 0; }
}
.ss-pulse-1 { animation: ss-pulse-ring  2.4s var(--ease-editorial) 3 forwards; }
.ss-pulse-2 { animation: ss-pulse-ring2 2.4s var(--ease-editorial) 0.6s 3 forwards; }
```

`iteration-count: 3; fill-mode: forwards` — stops after 3 cycles, ring stays at final state (opacity 0). Ring animates `r` attribute on SVG circles; the underlying gold dots remain visible static.

### 5.7 Scroll-reveal (every section beyond hero)

Motion's `whileInView` with `once: true`:

```tsx
<m.div
  initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
>
```

Applied to: eyebrow tag, H2, first body paragraph, and major data block per section. Not every paragraph (over-animated).

### 5.8 Magnetic button choreography (site signature)

All primary and secondary CTAs use the Button-in-Button pattern with hover physics per `high-end-visual-design` §5B:

- Button base transition: `all 260ms cubic-bezier(0.32, 0.72, 0, 1)`
- On hover: parent button shifts background (primary → `--brand-primary-dark`; secondary → border shifts to teal, text to teal)
- On hover: inner circular icon wrapper translates `translate(2px, -1px)` + scales `1.05`
- On active: parent button scales `0.98` (physical press simulation)
- Shadow deepens on hover for primary (second layer grows)

Group utility pattern (Tailwind-style pseudo):

```tsx
<button className="group">
  <span>Read the proposal</span>
  <span className="icon-wrap group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105">
    <ArrowRight />
  </span>
</button>
```

### 5.9 Data table motion

- **Row hover:** background `transparent → rgba(12,124,138,0.04)`, 160ms `--ease-gentle`. No translate.
- **Row hover cross-highlight:** fires `distribution:highlight` custom event → InteractiveMap adds transient teal ring around matching dot, 240ms `--ease-gentle`. Inverse also works (hover map dot → row highlights).
- **Column sort click:** sort caret rotates 180deg, 280ms `--ease-editorial`.
- **Filter state change:** rows animate out/in via Motion `AnimatePresence` with `layout` (opacity only; layout changes are expensive).

---

## 6. Component architecture

### 6.1 Double-Bezel (Doppelrand)

Applied to: hero map frame, data table, scenario tool mock (§7.6), Abound console mock (§7.8), case-manager search (§7.9), API code block (§7.10), partner cards (§7.11).

**Outer shell:**
```tsx
<div className="p-1.5 rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] ring-1 ring-[rgba(10,10,11,0.06)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(10,10,11,0.03)]">
  {/* Inner core */}
</div>
```

**Inner core:**
```tsx
<div className="rounded-[calc(1.75rem-0.375rem)] bg-white overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,20,30,0.04),0_20px_40px_-20px_rgba(15,20,30,0.12),0_40px_80px_-40px_rgba(15,20,30,0.08)]">
  {/* Content */}
</div>
```

Concentric radii are non-negotiable. Never hardcode `rounded-[22px]` separately — always `calc(1.75rem - 0.375rem)` to preserve the relationship if the outer radius ever changes.

### 6.2 Button-in-Button (primary + secondary CTAs)

**Primary CTA** (teal pill, white text, nested arrow):

```tsx
<button className="group inline-flex items-center gap-2.5 rounded-full bg-[--brand-primary] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_-4px_rgba(12,124,138,0.42),0_1px_2px_rgba(12,124,138,0.18)] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[--brand-primary-dark] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_20px_-4px_rgba(12,124,138,0.5),0_1px_2px_rgba(12,124,138,0.22)] active:scale-[0.98] font-[Geist] tracking-[-0.01em]">
  <span>Read the proposal</span>
  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/20 transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/30 group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105">
    <ArrowRight weight="light" className="h-3.5 w-3.5" />
  </span>
</button>
```

**Secondary CTA** (outlined, ink text, nested teal-tinted icon):

```tsx
<button className="group inline-flex items-center gap-2.5 rounded-full border border-[rgba(10,10,11,0.14)] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-[--ink] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[--brand-primary] hover:text-[--brand-primary] active:scale-[0.98] font-[Geist] tracking-[-0.01em]">
  <span>How it works</span>
  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[--brand-primary-light] transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-[rgba(12,124,138,0.14)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105">
    <ArrowDown weight="light" className="h-3.5 w-3.5 text-[--brand-primary]" />
  </span>
</button>
```

**Nav mini-CTA** (same pattern, smaller — 22px icon wrapper, 6px/14px padding, ink-black background).

### 6.3 Eyebrow tag (mono label above every major H2)

```tsx
<span className="inline-flex items-center gap-[7px] rounded-full bg-[rgba(12,124,138,0.07)] border border-[rgba(12,124,138,0.14)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[--brand-primary-dark]">
  <span className="h-[5px] w-[5px] rounded-full bg-[--brand-primary]" />
  The problem
</span>
```

`font-mono` resolves to Geist Mono. The `0.18em` tracking is load-bearing — not 0.14em, not 0.2em. Consistent across all 10 section eyebrows.

### 6.4 Floating Fluid Island nav

Per `high-end-visual-design` §5A:

- Detached from top: `mt-6`
- Centered: `mx-auto`, `w-max`, `max-w-[92%]`
- Shape: `rounded-full`, `px-5 py-2` with right-side CTA that pushes padding asymmetrically (`pr-2`)
- Surface: `bg-white/78`, `backdrop-blur-xl`, `ring-1 ring-[rgba(10,10,11,0.07)]`
- Stacked shadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(15,20,30,0.04), 0 8px 24px -8px rgba(15,20,30,0.08)`
- Contents: Datawake mark (20px teal→dark-teal gradient square, rounded 6px) + wordmark "OC Pantry Coordination" (Geist 600) + vertical rule separator + "PROPOSAL" tag (Geist Mono 9px uppercase tracked) + anchor links ("The picture", "How it works", "Scope" — DM Sans 500 13px) + mini Button-in-Button "Contact" CTA
- Mobile (< 860px): anchor links hide; brand + CTA only
- On scroll: no behavior change (stays pinned, shadow does NOT deepen — Apple-pro rule: the nav is already maximally elevated, deepening reads as panic)

### 6.5 Component inventory

**shadcn/ui primitives (keep):**
- `Button` — rare direct use; prefer custom Button-in-Button for primary/secondary (§6.2). Shadcn `Button` used for tertiary text-link-style ghost actions inside tables.
- `Card` + `CardHeader` + `CardContent` — used in Team section only, wrapped in Double-Bezel
- `Badge` — used for storage badges (cold/dry), type badges (pantry/frc/school/mobile/appointment), capacity pills in the data table
- `Separator` — hairline between stat rows in Scope
- `Skeleton` — loading states for table + map
- **Drop:** Dialog, Sheet, Popover, Form, Table (static), Tooltip, Select, Tabs, Accordion, Command, Alert — not used in v1

**Third-party specialty:**
- **MapLibre GL JS** — interactive map (§7.3)
- **TanStack Table v8** — headless data grid (§7.4)
- **cmdk** — live command palette for Case Manager search (§7.9)
- **Shiki** — syntax-highlighted API code block (§7.10), custom theme matching Datawake palette
- **Motion** (formerly Framer Motion) — `LazyMotion` + `m` components, hero orchestration + scroll reveals + magnetic hovers (§5)
- **Phosphor React** (Light weight only) — all iconography (anti-Lucide per `high-end-visual-design` §2)

**Explicitly NOT used:**
- Lucide (banned)
- Material Icons (banned)
- FontAwesome (banned)
- Full `framer-motion` (use LazyMotion)
- AG Grid / Handsontable / RevoGrid (TanStack is more flexible)
- Shadcn static `Table` (need sort/filter)
- `Inter` font (banned per high-end-visual-design)

### 6.6 shadcn CVA variants

```tsx
// button variants (custom, extend shadcn)
// - primary: Button-in-Button teal pill (hero, CTA band)
// - secondary: Button-in-Button outlined (hero, ghost-prominent)
// - ghost: text-only with arrow glyph (table sorts, export, footer links)
// - link: inline prose link, teal, underline on hover
```

Never use `variant="default"` raw. Every button has an intentional variant.

---

## 7. Section-by-section treatment

Site has 11 sections (1 nav + 10 content + 1 footer). Spec §4.3 locks the 10-section structure.

### 7.1 Nav (Floating Fluid Island)

Per §6.4. Anchor links: "The picture" (#picture), "How it works" (#coordination), "Scope" (#scope). Nav CTA "Contact" scrolls to #cta-band.

### 7.2 Hero

- **Layout archetype:** Editorial Split, `grid-cols-[minmax(0,480px)_minmax(0,1fr)]` md+, gap 64px
- **Left column (headline block):**
  - Eyebrow (Geist Mono): "Coordination infrastructure"
  - H1 Display XL: "Shared food-rescue data for Orange County." (Orange County in teal)
  - Subline Body L muted
  - Primary + Secondary Button-in-Button CTAs (§6.2)
- **Right column:** Anaheim interactive map (§7.3) in Double-Bezel frame, sitting in the subtle teal atmospheric gradient (§3.3)
- **Motion:** Full §5.5 orchestration
- **Distinctive element:** the orchestrated hero reveal + gold overlap pulse + monospace metric caption. Signature moment.
- **Mobile:** stacks vertically, headline first, map below, atmospheric gradient hidden. Pulse still plays (respects reduced-motion).

### 7.3 Interactive map (embedded in Hero)

- **Frame:** Double-Bezel (§6.1)
- **Map:** MapLibre GL JS + OpenFreeMap positron tile style (light editorial map aesthetic)
- **Bounds:** Anaheim city `[-118.05, 33.79]` to `[-117.70, 33.89]`, zoom 10–15
- **Dots:** teal `--brand-primary`, gold `--brand-gold` for `isOverlap === true`. Radius 4–8 via zoom interpolation.
- **Interaction:**
  - Hover: popup (MapTooltip component) with site name, type, next distribution, storage, needs, overlap flag
  - Keyboard: visually-hidden `<ul>` below map, each item a focusable button that triggers the same tooltip state (per PLAN-REVISIONS.md Task 9 fix)
  - Filter chips below map: "Open today · Cold storage · Choice market · Needs dry goods · Overlap flagged"
- **Filter state:** shared with Data Table (§7.4) via `FilterContext`
- **Gold overlap caption:** positioned absolute bottom of map frame — gold-flag pill (Geist Mono, 10px uppercase, `--brand-gold-dark` on `--brand-gold-light`) + metric text in monospace + body sentence "The system cannot see this." Glass-backed white panel with stacked shadow
- **Textual summary** (for screen readers, also visible): "Representative distribution sites in Anaheim. Three sites flagged as overlapping on Saturday 9 am in central Anaheim. Filter by capability below."
- **Data props:** parent Server Component reads GeoJSON via `fs.readFileSync` at render time and passes as typed prop (per PLAN-REVISIONS.md Task 9 invert-data-flow fix)

### 7.4 The shared database (new narrative section after Hero)

Per spec §7.4, placement in narrative: Section 2, immediately after Hero, before "The problem."

- **Layout:** Asymmetrical Bento, `grid-cols-[1fr_280px]` lg+, gap 16px. Below 1000px the side card hides.
- **Eyebrow:** "The shared database"
- **H2 Display L:** "Every distribution, every week. One source of truth." ("One source" accent in `--brand-primary`)
- **Body (Body L, max 58ch):** "The map is one view of this data. The table is another. Same 20 representative Anaheim distribution sites, same filter state. Sort any column. Filter by capability. Export to CSV. Query via the public API."
- **Main column — data table:**
  - TanStack Table v8, headless, Double-Bezel frame (§6.1)
  - 20 rows, internal scroll at fixed height ~460px (pagination unnecessary at this scale)
  - **Columns:** Site (sortable, 220px), Type (filterable, 120px), Next (sortable by date, 140px), Storage (120px), Model (110px), Capacity (sortable, 120px), Needs (180px), Overlap flag (sortable, 48px)
  - Column headers: Geist Mono 9.5px uppercase tracked 0.14em, `--ink-muted`, hover → `--brand-primary`
  - Row hover: bg `rgba(12,124,138,0.04)`, 160ms `--ease-gentle`, cross-fires dot ring on map
  - Overlap rows: left-edge gold indicator (4px left border in `--brand-gold`) + subtle gold-tint row bg
  - Filter chips above table: same 5 chips as map, shared state
  - Footer: "20 of 20 sites · Filtered: [N]" (DM Sans muted, tabular) + "Export CSV" ghost button
- **Side card — Filter Snapshot:**
  - Compact card, Double-Bezel, narrower
  - Contents: "Filter state" label + active chips list + "N sites match" big number (Display S in Geist teal) + "Capacity distribution" micro-bar chart (inline, 4 bars: Open/Partial/Full/Closed stacked horizontal, 6px tall, tabular counts beside)
  - Sticky-ish at lg+ (doesn't fully stick; sits in-flow but visually elevated with its own ambient shadow)
- **Distinctive element:** cross-hover between row and map + the side-card micro-distribution. The "wow, it's actually connected" moment.
- **Accessibility:** `aria-sort` on sortable columns, `aria-live="polite"` region announces "N sites. Filtered to X." on filter change, row `tabIndex={0}` with keyboard activation

### 7.5 The problem

- **Layout:** single-column editorial, `max-w-[680px]` centered, `bg-[--surface-muted]` alternating section
- **Eyebrow:** "The problem"
- **H2:** "A food-rescue system that cannot see itself."
- **Body (80–150 words, no bullets):** Per spec §7.5 draft, with "moves food at scale" replacing unsourced "tens of millions of pounds" (Codex fix)
- **Distinctive element:** inline map cutout embedded mid-paragraph (right-floated desktop, full-width centered mobile), showing the Lincoln Ave overlap cluster zoomed tighter than the hero map, gold dots highlighted, ~220x160px, Double-Bezel with the 4-layer ambient shadow

### 7.6 The picture (LEAD — Strategic Planner view)

- **Layout:** Asymmetric split, `grid-cols-[minmax(0,520px)_minmax(0,1fr)]` md+, body text left, scenario tool mock right
- **Eyebrow:** "The picture"
- **H2:** "One shared picture, used by coalition leaders."
- **Body (150–250 words):** Victoria Sunday-night walkthrough. "32 percent projected coverage lift" tagged "(representative projection)" (Codex fix)
- **Right column — Scenario tool mock** (distinctive element):
  - Double-Bezel, header "Scenario · Consolidation preview" with `Geist Mono` tag
  - Inside: 3 pantry checkboxes (St. Luke's Sat 9–11, First Baptist Sat 9–11, Community Presbyterian Sat 10–12), storage badges, micro-preview
  - Below: "Proposed site: Anaheim FRC, Sat 9 am–12 pm" radio (single option)
  - Below that: metrics panel — "Combined family reach", "Supply concentration", "Walk-distance impact" — each as label + horizontal bar gauge with "(representative)" tag
  - Ghost "Compare before/after" button (mock, non-functional)
  - Footer disclaimer line

### 7.7 Coordination without a login

- **Layout:** `grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]` md+, copy left, exchange right
- **Eyebrow:** "Coordination without a login"
- **H2:** "Pantries stay in their inbox."
- **Body (100–150 words):** "hundreds of operators" (scrubbed from "300-plus" per Codex)
- **Right column — Text message exchange:**
  - Double-Bezel styled as phone screen (slight portrait aspect desktop)
  - "Sample exchange · representative" mono tag label
  - 3–4 chat bubbles: system (neutral white), operator reply (teal `--brand-primary` right-aligned), system confirmation (neutral)
  - Datawake-teal for operator messages, paper-neutral for system, matches the direction — NOT a generic iMessage blue clone
  - Characters: Karen at St. Mark's

### 7.8 The live state (Abound console)

- **Layout:** single column, `max-w-[1100px]`, full-bleed console mock
- **Eyebrow:** "The live state"
- **H2:** "Abound opens one console every morning."
- **Body (100–150 words)** per spec
- **Console mock (distinctive element):**
  - Double-Bezel wrapping application-window aesthetic
  - Window chrome: macOS-style dots (muted, not colored red/yellow/green — use `--ink-faint`, `--rule-cool`, `--rule-cool` in that order) + mono timestamp "Tue Apr 28 · 7:42 am PT"
  - 3-column grid: Supply Pipeline (teal accents) · Distribution Calendar (neutral) · Routing Queue (gold accents for AI-flagged items)
  - Each column: mono eyebrow header + ~3 list items
  - Subtle hover matches row-hover in data table
- **Caption below window:** "Representative layout. Real console lives in the Abound account post-deploy."

### 7.9 A door for every family (LIVE cmdk search)

- **Layout:** `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` md+, copy left, live search right
- **Eyebrow:** "A door for every family"
- **H2:** "A case manager finds the right pantry in under a minute."
- **Body (80–120 words):** "a short walk" instead of unsourced "0.6-mile walk" (Codex fix)
- **Right column — LIVE cmdk command palette:**
  - NOT a static screenshot. Actual `cmdk` component wrapped in Double-Bezel.
  - Input pre-populated with "walkable 92804 open today spanish-speaking no appointment kid friendly"
  - Results update live on type/clear. Keyboard navigable (arrows cycle).
  - 3 result items with plain-English reasoning below each
  - Click/Enter opens a representative detail sheet (mock)
  - Real product working in real time
- **Accessibility:** cmdk inherits keyboard support; `aria-live` on result count
- **Fallback:** if cmdk fails to load, renders static mockup with same visual

### 7.10 Public infrastructure

- **Layout:** `grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]` md+, copy left, code block right
- **Eyebrow:** "Public infrastructure"
- **H2:** "Open source. Public APIs. Any county can fork it."
- **Body (80–120 words)** per spec
- **Badge pills below body:** "GitHub · OpenAPI · MIT or Apache 2.0 · Any county can fork" — Geist Mono labels on `--surface-muted` pills
- **Right column — Shiki API code block:**
  - Double-Bezel, `--surface-ink` inner core (deep near-black background — the one place this direction uses a dark surface)
  - Custom Shiki theme matching Datawake palette: teal keys, gold flags, muted ink faint for brackets and punctuation
  - GET request + JSON response with representative distribution data
  - "Copy" button top-right (Phosphor Light Copy icon in mini-Button-in-Button wrapper)

### 7.11 Who's building this

- **Layout archetype:** Z-Axis Cascade — 3 partner cards with slight `-1.5deg` / `+1deg` / `-0.5deg` rotation and subtle negative-margin overlap (collapse to stacked single column below 768px per `high-end-visual-design` §3B)
- **Eyebrow:** "Who is building this"
- **H2:** "Three partners, three specific roles."
- **3 cards, each Double-Bezel:**
  - **Abound Food Care** — product owner / grant applicant / operator. Logo placeholder (gold-tint square, TBD asset, styled as intentional).
  - **A Million Dreams Consulting (Victoria)** — co-PM / domain expert / adoption lead.
  - **Datawake** — builder / maintainer. Flattened copy per Codex: "Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub." No stack list, no "production-grade," no "cutting-edge."
- **Distinctive element:** Z-Axis Cascade breaks the generic "three equal cards" Bootstrap cliché. Subtle rotation + overlap (never more than -1.5deg, never more than 16px overlap) signals care.

### 7.12 V1 scope, timeline, budget

- **Layout:** Asymmetrical Bento — scope 8 col, timeline + budget 4 col stacked
- **Eyebrow:** "V1 scope, timeline, budget"
- **H2:** "What the first release delivers."
- **Scope (8 col):** 8 bullet items, each with 2px teal left-border indicator (not `<li>` bullet dots — too generic)
- **Timeline (4 col top):** 4 definition-list rows, label/value pairs
- **Budget (4 col bottom):** strong numbers in Display S (Geist 600, tight tracking), teal. "$100–200K build" and "~$100K maintenance over 3 years" with a small Geist Mono note "Line item inside Abound's grant."
- **Distinctive element:** budget numbers in Display S Geist (not body DM Sans). The direction puts the engineered type on the load-bearing numbers.

### 7.13 CTA band

- **Layout:** full-bleed, `bg-[--brand-primary-dark]` with subtle inner radial gradient (teal → slightly-darker teal toward corners), text reversed to `--surface-paper`
- **Eyebrow:** "Next steps" in `--brand-gold-light` with opacity
- **H2 on dark:** "Let us build this together."
- **Body (centered, max 52ch):** "For Victoria: reply in the email thread with comments. For Mike: we have 9 am PT on Tuesday May 5 on the calendar."
- **CTAs:** Primary in `--brand-gold` (documented exception — gold as anchor on deep-teal surface where teal would vanish), secondary outlined white
- **Distinctive element:** single full-bleed dark band provides visual weight + closure after the Bento section. Stacked ambient shadow still applies to the CTA buttons inside; the dark surface has its own mild atmospheric highlight near the top

### 7.14 Footer

- **Layout:** single line desktop, stacked mobile, `bg-[--surface-muted]` with hairline top border
- **Contents:** "Built with Abound Food Care by Datawake. © 2026." + representative-data disclaimer + Datawake mark bottom-right (20px teal→dark-teal gradient square)

---

## 8. Data table deep-spec (§7.4 detail)

### 8.1 Tech

- **Library:** TanStack Table v8 (`@tanstack/react-table`)
- **Why not RevoGrid:** opinionated UI fights the design system
- **Why not shadcn Table static:** need sort/filter/interactive state

### 8.2 Columns (final)

```ts
export const columns: ColumnDef<DistributionFeatureProperties>[] = [
  { accessorKey: 'name', header: 'Site', cell: SiteCell },                 // 220px, sortable
  { accessorKey: 'type', header: 'Type', cell: TypeBadge },                // 120px, filterable
  { accessorKey: 'nextDistribution', header: 'Next', cell: NextCell },     // 140px, sortable
  { accessorKey: 'storage', header: 'Storage', cell: StorageBadges },      // 120px
  { accessorKey: 'model', header: 'Model', cell: ModelBadge },             // 110px
  { accessorKey: 'capacityLabel', header: 'Capacity', cell: CapacityPill },// 120px, sortable
  { accessorKey: 'specificNeeds', header: 'Needs', cell: NeedsPillList }, // 180px
  { accessorKey: 'isOverlap', header: '', cell: OverlapIndicator },        // 48px, sortable
];
```

### 8.3 Row cross-highlight

On row `onMouseEnter`:
1. Fire `distribution:highlight` event with site id
2. InteractiveMap subscribes via `FilterContext` and adds transient teal ring on matching dot
3. On `onMouseLeave`, clear ring

Inverse: hover map dot → row highlights. Same cross-highlight on keyboard focus (`:focus-visible`).

### 8.4 Filter state

```ts
// FilterContext
interface FilterContextValue {
  state: FilterState;
  setState: (s: FilterState) => void;
}
```

InteractiveMap and DataTable both consume. Filter chips component exists once, placed between map and table desktop, above each mobile.

### 8.5 Visual density

- Row height: 44px (compact but readable)
- Cell padding: `px-3 py-2.5`
- Column header: sticky at table top within Double-Bezel container
- Zebra stripes: none (too generic). Hairline `border-bottom` on rows only, `--rule-cool`.
- Font: DM Sans 400 body, `tabular-nums` on numeric cells
- Site name in `--ink`, neighborhood sublabel in `--ink-muted` 11.5px

### 8.6 Accessibility

- Semantic `<table>` with `<thead>` / `<tbody>`
- `aria-sort="ascending|descending|none"` on column headers
- Row `tabIndex={0}`, `onKeyDown` activation triggers cross-highlight
- `aria-live="polite"` announcer: "20 sites. Filtered to X." on filter change

---

## 9. Icons

- Library: **Phosphor React** (`@phosphor-icons/react`)
- Weight: **Light** only (never Regular, Bold, Duotone, Fill)
- Default size: 16px (`h-4 w-4`) or 20px (`h-5 w-5`)
- Color: inherits from parent via `currentColor`

Mapping:

| Use | Phosphor icon |
|---|---|
| Primary CTA arrow | `ArrowRight` |
| Secondary CTA down-scroll | `ArrowDown` |
| External link | `ArrowUpRight` |
| Sort indicator | `CaretUp` / `CaretDown` |
| Copy (code block) | `Copy` |
| Filter chip close | `X` |
| Overlap flag | gold dot (CSS circle, no icon) |
| GitHub badge | `GithubLogo` |
| Storage cold | `Snowflake` |
| Storage dry | `Package` |
| Search input | `MagnifyingGlass` |
| Export CSV | `ArrowLineDown` |

No emoji anywhere. No Lucide, Material, FontAwesome.

---

## 10. Performance

### 10.1 Bundle

- Geist + DM Sans + Geist Mono via `next/font/google` (automatic subsetting)
- MapLibre: ~160KB gzip — critical path, acceptable for hero
- TanStack Table: ~20KB gzip
- cmdk: ~12KB gzip
- Shiki: lazy via `dynamic(() => import(...))`, ~90KB for one code block
- Motion: `LazyMotion` + `m` components, ~7KB core
- Phosphor React: individual imports tree-shake, ~2KB per icon

### 10.2 Targets (Lighthouse mobile, throttled)

- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.05
- Total JS: < 350KB gzip critical path

### 10.3 Techniques

- Map container reserves space before MapLibre mounts (explicit `aspect-ratio`) → no CLS
- Fonts `font-display: swap` + size-adjust metrics
- Images: `next/image` with explicit dimensions, SVG for logos
- Above-fold images `priority`, below-fold lazy
- CSS token-driven, no runtime CSS-in-JS
- `backdrop-blur` ONLY on fixed/sticky elements (nav, map caption, console window chrome) — never on scrolling content (GPU repaint killer per `shadcn-radix-tailwind`)
- Atmospheric gradients are `position: absolute` children with `pointer-events: none` and `z-index: 0`, cheap to composite

---

## 11. Accessibility contract

Per spec §4.8 plus specifics:

- **Every interactive element** keyboard reachable, visible teal focus ring (3:1 minimum contrast against paper)
- **Map** has visually-hidden focusable list alternative + visible text summary
- **Table** sort announces via `aria-sort`, row keyboard nav via `tabIndex` + `onKeyDown`, cross-highlight fires on `:focus-visible`
- **cmdk search** inherits built-in keyboard support; `aria-live` announces result count
- **Heading hierarchy:** one H1 (hero), H2s per section, H3s inside cards. No skipping levels.
- **Color contrast:** all pairs documented §3.5, unit-tested `lib/contrast.ts`
- **`prefers-reduced-motion`:** disables pulse, scroll reveals, magnetic hovers, atmospheric gradients (hides them). All content reachable without motion.
- **Focus management:** when the cmdk inline detail panel or scenario-tool mock expands, focus moves to the panel's heading (or first focusable element within); on collapse, focus returns to the triggering result item. Because these are inline expansions (not modals), focus is NOT trapped — surrounding content remains tab-accessible. If a future design change makes either a true modal, add focus trap at that time.
- **Alt text:** descriptive on logos; decorative SVGs `aria-hidden="true"`
- **Landmarks:** `<header>` (nav), `<main>` (content), `<footer>`. Each section `<section aria-labelledby>`.
- **375px width:** usable, no horizontal scroll
- **Touch targets:** all interactive 44px minimum tap height

---

## 12. Anti-patterns (enforced at code review)

### Typography
- No Inter, Roboto, Arial (except fallback), Open Sans, Helvetica (except fallback), Instrument Serif, Fraunces, Source Serif 4
- No italic display emphasis (color is the emphasis vehicle in Grotesk)
- No generic 16px body everywhere — use Body L/M/S distinctions
- No DM Sans uppercase-spaced labels — Mono is the metadata voice

### Color
- No hardcoded hex in components — token references only
- No gold used decoratively — semantic only (documented CTA-band exception)
- No pure white page surfaces — paper `#F7F6F3`
- No pure black text — near-black `#0A0A0B`
- No purple-to-pink gradients
- No mesh gradients / 3D blobs — single subtle teal atmospheric radial per section only
- No AI stock photography
- No film grain overlays (that's Direction 01)

### Layout
- No edge-to-edge sticky navbar — Floating Fluid Island pill only
- No symmetrical 3-column Bootstrap grids — use Asymmetrical Bento or Z-Axis Cascade
- No `h-screen` — `min-h-[100dvh]` only
- No layout shift from fonts or images — reserve space with `aspect-ratio`
- No overlapping elements outside the explicit Z-Axis Cascade partner cards

### Motion
- No `linear` or `ease-in-out` — custom cubic-bezier only
- No animations on `top`, `left`, `width`, `height`, `margin` — `transform` + `opacity` + `filter: blur` only
- No `backdrop-blur` on scrolling content — fixed/sticky only
- No instant state changes on hover — always interpolate
- No long auto-playing loops — pulse is 3 cycles then stops (`iteration-count: 3; fill-mode: forwards`)
- No filler motion ("bouncing scroll chevron", "scroll to explore") per `stitch-design-taste`

### Components
- No Lucide, Material, FontAwesome icons
- No raw `<input>` / `<button>` when shadcn primitives fit the need
- No `<div onClick>` for interactive elements — use `<button>` / `<a>`
- No shadcn components without Tailwind token references
- No `asChild` with a non-focusable child
- No harsh single-layer drop shadows — stacked 4-layer ambient only
- No 1px generic gray borders — `ring-1 ring-black/5` or `border-[--rule-cool]`

### Copy
- No em dashes as clause separators in rendered user-facing copy
- No banned SaaS vocabulary: empower, leverage (verb), unlock, transform your, seamlessly, game-changer, move the needle, unleash, in today's fast-paced world, synergy, revolutionize, best-in-class, cutting-edge, world-class, take to the next level
- No unsourced quantitative claims — cite, scrub to qualitative, or tag "(representative)"
- No "production-grade," "next-gen," "AI-powered" without a named mechanism
- Every claim has source, example, named mechanism, or representative label
- No generic placeholder names ("John Doe", "Acme") per `stitch-design-taste`

---

## 13. Change log

- **v2 (2026-04-22):** Direction locked to Soft Structuralism after 5-way side-by-side review. Typography: Geist display, DM Sans body, Geist Mono metadata. Surface: silver-warm paper `#F7F6F3`. Ink: near-black `#0A0A0B`. Emphasis on "Orange County" via teal color (not italic). Double-Bezel 1.75rem. Stacked 4-layer ambient shadow system. Button-in-Button magnetic choreography. Subtle teal atmospheric gradient per section. Z-Axis Cascade for team cards. Asymmetrical Bento for data section with side-card filter snapshot. New "shared database" section (§7.4) with TanStack Table + cross-hover to map + shared filter state. Live cmdk for case-manager search. Shiki for API block. Phosphor Light icons.
- **v1 (2026-04-22, superseded):** Editorial Infrastructure direction (Instrument Serif + DM Sans, warm cream, film-grain overlay). Not picked after side-by-side review. See `.superpowers/brainstorm/68112-1776888502/content/` for archived preview.
