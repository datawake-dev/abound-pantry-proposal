# Claude Design Brief — OC Pantry Coordination Network Proposal Site

**Purpose:** A one-page Vercel site pitching a pantry-coordination platform concept to Abound Food Care (Orange County nonprofit) inside a grant proposal. Grant deadline May 15, 2026. Victoria Torres at A Million Dreams Consulting reviews first, then Mike at Abound.

**Tone:** Grown-up infrastructure work. Editorial + data-forward. Institutionally credible. Not SaaS marketing, not charity guilt, not generic.

---

## The product the site is pitching (context, not content)

A two-sided live coordination layer for OC's food-rescue ecosystem:
- **Pantries** post weekly state via email/SMS (no login; AI parses replies)
- **Abound** posts incoming supply events (grocery rescue, donations); AI suggests routing
- **Strategic planners** (Victoria, coalition staff) see a heat map + weekly AI brief + scenario tool for consolidation decisions
- **Case managers** use natural-language search to find a pantry for a family in under a minute
- **Open-source, public APIs, forkable by any county**

Five AI pillars: conversational collection (lead adoption story), routing suggestions, gap/overlap detection, case-manager search, data stewardship.

---

## Site structure (10 sections + header/footer)

1. **Hero** — headline + subline + primary/secondary CTAs + interactive Anaheim map as hero visual
2. **The problem** — one concrete micro-story (three pantries colliding Saturday 9am in central Anaheim), not bullet soup
3. **The picture** (LEAD narrative) — Strategic Planner view walked through; what Victoria does once a week
4. **Coordination without a login** — the conversational pantry pillar; representative text-message exchange
5. **The live state** — Abound's morning console; supply pipeline × distribution calendar × AI routing queue
6. **A door for every family** — case-manager natural-language search in under a minute
7. **Public infrastructure** — open source + public APIs + any county can fork
8. **Who's building this** — three partner cards: Abound Food Care, A Million Dreams Consulting (Victoria), Datawake
9. **V1 scope, timeline, budget** — what's committed. Scope bullets, timeline rows, $100–200K build + ~$100K 3yr maintenance
10. **What's next** — CTA section with email + calendar links

---

## Locked hero copy (use verbatim)

> **Shared food-rescue data for Orange County.**
>
> Open directory. Live distribution state. Public APIs. Built with Abound Food Care.

Primary CTA: "Read the proposal" → `#picture`
Secondary CTA: "How it works" → `#coordination`

---

## Approved design direction: "Editorial Infrastructure"

A refinement of data-forward (think Our World in Data, The Pudding, USAFacts) with editorial discipline (FT Graphics, NYT interactives, 18F):

- **Display typography:** **Instrument Serif** for hero headline, section headings, and standalone numbers. Italic the one privileged word per headline ("Orange _County_"). Editorial, earned, not generic.
- **Body typography:** **DM Sans** (Datawake brand) for everything else. 400/500/600/700 weights. Tabular-nums for inline numbers.
- **Surface color:** Warm white (#FAFAF7), not pure white. Teal (#0C7C8A) for identity + interactive. Deep teal (#085A66) for headings/emphasis. Warm gold (#D4A843) **reserved for semantic meaning only** (overlap flagged, alert, callout). Never decorative.
- **Motion:** One orchestrated hero reveal: label → headline → subline → CTAs staggered in, then the Anaheim map fades in and the gold overlap cluster pulses for 3 cycles with caption "Three pantries, same block, same hour. The system cannot see this." Nothing else animates unless user hovers.
- **Grid DNA:** 12-column baseline, 3–4 intentional grid breaks (hero map bleeds right edge, scope splits asymmetrically, CTA full-bleed).
- **Data treatment:** Numbers in the display font (Instrument Serif). Stats feel editorial, not spreadsheet-y.
- **Unforgettable 3 seconds:** the overlap pulse + caption makes the product argument visible on load.

**Visual reference:** `.superpowers/brainstorm/68112-1776888502/content/editorial-infrastructure-direction.html` (the hero preview rendered with real Instrument Serif + DM Sans + pulse animation).

---

## Datawake brand tokens (inherit strictly)

```
Primary teal:        #0C7C8A
Primary teal dark:   #085A66
Primary teal light:  #E8F5F7
Warm gold:           #D4A843
Gold dark:           #92710A
Gold light:          #FFF8E7
Ink (body):          #1A1A1A
Ink heading:         #1C2D3A
Ink muted:           #6B7280
Rule:                #E2E8F0
Surface:             #FFFFFF
Surface warm:        #FAFAF7
Surface muted:       #F7F9FA
```

Fonts: `Instrument Serif` (display, Google Fonts), `DM Sans` (body, Google Fonts — Datawake brand).

---

## Interactive map (hero)

- **Scope:** Anaheim, CA only (not full OC). Matches the grant's pilot footprint.
- **Data:** ~20 representative distribution-site dots. Clearly labeled as demo data. Real data comes later.
- **Treatment:** MapLibre GL JS with OpenFreeMap tiles. Pantries as teal dots, overlap cluster in gold. Filter chips below map: "Open today", "Cold storage", "Choice market", "Needs dry goods", "Overlap flagged".
- **Interaction:** Hover tooltip (not click-only) with site name, next distribution, storage, specific needs. Dots keyboard-accessible via a visually-hidden list alternative. Textual map summary beneath (WCAG required).
- **Motion:** Gold cluster pulses for 3 cycles on initial load; then static.

---

## Tech stack the site will be built on (context for component generation)

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (`@theme inline` design tokens)
- shadcn/ui primitives where they earn their place: Button, Card, Badge. NOT Dialog/Sheet/Popover/Form (no interactive surfaces beyond the map). NOT Tooltip (map tooltips are MapLibre-native).
- Motion (formerly Framer Motion) — **sparingly**. Only for the one orchestrated hero reveal + pulse. `LazyMotion` + `m` components to minimize bundle.
- MapLibre GL JS for the interactive map
- pnpm package manager
- Vercel deployment

---

## Hard rules (enforced at review)

### Copy rules

- **No em dashes as clause separators** anywhere in rendered copy. Use commas, colons, periods, or rewrite.
- **Banned vocabulary:** empower, leverage (verb), unlock, transform your, seamlessly, game-changer, move the needle, unleash, in today's fast-paced world, synergy/synergies, revolutionize, revolutionary, best-in-class, cutting-edge, world-class, take to the next level.
- **No unsourced numbers.** Every quantitative claim must be either: cited (with a source), scrubbed to qualitative ("hundreds" not "300+"), or explicitly labeled "(representative)" / "(example)" / "(projected)".
- **Nonprofit-executive tone.** Not SaaS-founder tone. Victoria and Mike read this; a grant reviewer reads this indirectly.

### Visual rules

- No purple-to-pink gradients. No generic 3D blobs. No AI stock photography.
- No emoji bullet icons. No lucide-react icon spam.
- No "trusted by" logo grid with fake logos.
- One primary type contrast (hero → body). Not seven competing sizes.
- Color restrained. Gold is semantic, never decorative.
- Every claim: source, example, or named mechanism. No "AI-powered" hand-waving.

### Accessibility contract (WCAG AA)

- Every interactive element keyboard-reachable, visible focus ring (teal).
- Map has a text summary + keyboard-accessible list of distributions beneath.
- Contrast ratios: body ≥ 4.5:1, large text ≥ 3:1. Test teal and gold combinations specifically.
- Semantic HTML + landmarks.
- `prefers-reduced-motion` respected: pulse disables, all animations disable.
- Works at 375px width.
- Loads in under 3 seconds on a typical mobile connection.

---

## What to produce

1. Interactive prototypes of each of the 10 sections, using real Datawake tokens and DM Sans + Instrument Serif fonts.
2. A Next.js 16 project scaffold matching the tech stack above.
3. Exportable code that Claude Code can take and polish.

**Upstream docs to read for full context:**
- Spec: `docs/superpowers/specs/2026-04-22-proposal-site-design.md` (411 lines, full detail)
- Plan: `docs/superpowers/plans/2026-04-22-proposal-site-implementation.md` (3755 lines, original implementation plan)
- Codex revisions to apply: `docs/superpowers/plans/PLAN-REVISIONS.md`

---

**Questions or ambiguity:** stop and ask. Do not fabricate numbers, do not invent copy, do not pick fonts outside the approved pair. Everything else is your creative latitude.
