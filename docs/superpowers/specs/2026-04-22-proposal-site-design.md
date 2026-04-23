# OC Pantry Coordination Network — Proposal Site Design

**Date:** 2026-04-22
**Status:** Draft v1 (post-brainstorm, pre-plan)
**Owner:** Dustin Cole (Datawake)
**Brainstorm session:** 2026-04-22 (superpowers:brainstorming)
**Upstream artifacts:** `/Users/dustin/projects/clients/prospects/Abound/2026-04-21-strategy-planning.md`; 2-pager v1 (Doc 1aXvdYmqOaUPL8WVI0qdastMGvqHEPeMNXxKS0dxSOnU); 2-pager v2 (Doc 1tSVScEgAd7nzZNnChGYhAqmirBSP0vKPLDrZG4c3qhQ); meeting notes (Doc 1VoCVVj-L_AIcUReuExc_HYXQpF1y7stiQBft5sr21JM, Doc 1Xo14tE0JRhwgFbkrVr0o0ockJ5lYre3iEjcWyrBPONE).

---

## 1. Context and purpose

Abound Food Care (Mike) is writing a grant of up to $6M with a May 15, 2026 deadline. A pantry-coordination platform ("OC Pantry Coordination Network") is a line item inside that grant, roughly $100–200K build + $100K over three years maintenance. The existing 2-pager for the concept reads as a database with a map on top, not a real product.

This spec defines the **proposal site** that replaces the 2-pager as the primary external artifact for communicating the concept. The site is the pitch. The 2-pagers stay as secondary archival PDFs.

Two goals:

1. **Expanded product vision.** A coherent enough articulation of what the platform does, for whom, and how, so the site can describe it as a real application with real workflows (not infrastructure with a viewer).
2. **A beautifully crafted one-page site.** Deployed on Vercel. Victoria reviews first, then Mike. Must demonstrate product craft (a proxy for the build quality Abound would get).

## 2. Audiences

In order of primacy:

1. **Victoria Torres (A Million Dreams Consulting).** Co-product manager. Reviews first, gives feedback, determines what Mike sees.
2. **Mike (Abound Food Care).** Grant author, product owner, paying customer. Sees the polished version for the May 5 call. Grant reviewer proxy.
3. **Grant reviewers (indirectly).** The site may be linked from or referenced in the grant application. Should read as credible to a funder who has never met Datawake.
4. **Future coalition partners.** OC Hunger Alliance members, 211 OC, CalOptima, others who might interact with the platform once built.

The site speaks in a nonprofit-executive tone, not a SaaS-founder tone.

---

## 3. Product vision (what the site describes)

### 3.1 The problem

Orange County's food-rescue system runs blind. Hundreds of pantries, family resource centers, school pantries, mobile distributions, and appointment-based programs each maintain their own data in spreadsheets, calendars, and phone calls. Second Harvest, Abound, OC Food Bank, 211 OC, Meals on Wheels, CalOptima, and other coordinating agencies cannot see each other's state. The consequences:

- **Invisible duplication.** Multiple pantries distributing on the same block at the same time; gaps on other days in the same neighborhood.
- **Dilution of supply.** Many small pantries splitting a limited food supply instead of concentrating into dignified choice markets with wraparound services.
- **Suboptimal dispatch.** When food becomes available (grocery-rescue pickups, warehouse donations, corporate drives), Abound has no live view of which pantries have capacity, cold storage, or schedule fit.
- **Stale data everywhere.** 211 OC and Second Harvest's manual pantry lists are constantly out of date. An existing Anaheim Google Calendar was abandoned because contributing organizations had no incentive to maintain it.
- **No shared analytical layer.** No one can see "ZIP 92802 has zero distributions Monday through Wednesday and Magnolia SD reports 47 homeless-roster families in-boundary." The system cannot see itself.

### 3.2 Entity model

The platform models the food-rescue ecosystem as a coordination graph, not a pantry directory. First-class entities:

**Distribution sites** — places where food goes out.
- Pantries (church-run, community-run)
- Family Resource Centers (FRCs)
- School pantries (e.g., Magnolia SD, one per school)
- Mobile distributions (e.g., Anaheim's green truck visiting 33 communities 3 times a year)
- Appointment-based programs (e.g., Love Anaheim)

Profile: location, service area, storage capability (dry + cold, capacity), distribution model (box vs choice), permanent hours, contact(s), program memberships (Grocery Rescue, Abound transport list, etc.).

**Distributions** — the scheduled events where food actually moves out. The primary unit of coordination.

Each distribution: host site, date and time window, model (box/choice), this-week state (open/closed/modified, expected volume, current capacity, specific needs), supply assigned, post-event confirmation (served count).

**Supply sources** — places food comes from.
- Grocery stores (Albertsons, Walmart, Target, Ralphs, Stater Bros, 99 Cents, etc.) with pickup windows (Albertsons 4pm daily), program memberships (Grocery Rescue via Second Harvest vs direct-to-nonprofit arrangements)
- Scheduled donors (food drives, corporate donors)
- Abound warehouse

**Supply events** — scheduled movements of food into the network. Source, scheduled time, estimated composition (cold/dry split, rough weight), status (scheduled → picked up → in transit → delivered), assigned distribution(s), transporter.

**Transport providers** — Abound (primary), Second Harvest's own fleet, pantry self-pickup. Each supply-event-to-distribution assignment picks a transporter.

**Demand signals** — school homeless rosters, SNAP enrollment density by ZIP, aggregated case-manager queries. Inputs into the AI gap-detection engine. Privacy-respecting (aggregates only). Abound and Victoria determine which signals are surfaced and how they are used.

### 3.3 Personas

1. **Site operator.** Volunteer or staffer at a distribution site. Primary channel: email + SMS (not the app). Posts this-week state via conversational reply. Never has to log in.
2. **Abound ops (Mike's team).** Dispatch and coordination. Opens the platform every morning. Primary surface: Abound console (desktop-first).
3. **Strategic planner (Victoria, coalition staff).** Cross-org view. Opens weekly or per decision. Primary surface: strategic dashboard + scenario tool (desktop-first).
4. **Case manager.** Read-only. Social workers, school staff, 211 operators, FRC generalists. Uses natural-language search when a family needs food this week. Primary surface: responsive web and PWA on phone.
5. **Abound field staff.** Drivers, warehouse loaders, pickup runners. PWA for mid-route status updates (confirm pickup, confirm delivery).

Out of scope: end users / food seekers (general public), booking flows for families, grocery-store light portal (Abound maintains that data instead).

### 3.4 Coordination loop (two-sided, live)

**Pantry side (via email/SMS, no login).**

Sunday evening each week, the platform messages every site operator:

> Hi Karen. Any updates for St. Mark's this week? Reply with capacity, specific needs, schedule changes, or "same as usual."

Karen replies:

> Tuesday same, 80 bags, need pasta and canned protein, cold capacity ~150 lb. Saturday normal.

AI parses, updates both distributions' state, and replies:

> Got it. Tue 4 to 6pm: 80 bags, short on pasta and protein, 150 lb cold open. Sat 9 to 11am: usual. Reply CHANGE if wrong.

Mid-week, when Abound routes supply to Karen's Tuesday distribution, Karen gets a text:

> Abound routing 180 lb dry + 120 lb cold to your Tue 4pm from Ralphs Brea. ETA 4:15. Reply RECEIVED when it arrives.

After the distribution Karen replies "received, served 72." AI updates the distribution record.

**Abound side (desktop console).**

Mike's team opens the console each morning and sees:

- **Supply pipeline (left column).** Today's and this week's scheduled pickups: source, estimated composition, timing, status.
- **Distribution calendar + map (center).** This week's distributions across the network, color-coded by supply state (fully supplied, partially supplied, unfilled, closed).
- **Routing queue (right column).** AI-suggested assignments (supply event to distribution), awaiting confirmation. One-click accept, drag to alternate, flag for review.
- **Alert bar (top).** Gaps (ZIPs with high need and no distributions), overlaps (same block same time), stale profiles, anomalies.

**Strategic-planner side (Victoria / coalition).**

- **Heat map.** Distribution density, unmet capacity, demand overlays (SNAP density, school homeless counts) in user-selectable layers.
- **Weekly AI strategic brief.** Narrative of gaps, overlaps, consolidation candidates with reasoning.
- **Scenario tool.** Model "what if" consolidations before touching live data (see 3.6).
- **Exports and API access** for grant reporting and coalition communication.

**Case-manager side (responsive web or PWA).**

Single natural-language input: "Spanish-speaking, family of 5, walking distance from 92802, open this week, no appointment." Ranked results with reasoning ("open in 2 hours, 0.6 mi walk, Spanish-speaking volunteer, no appointment, cold storage available"). Shareable result link the case manager can forward to a family. No family account.

### 3.5 Five AI pillars

In order of visibility, not sequencing:

1. **Conversational collection (pantry-facing, lead adoption story).** AI parses inbound email and SMS replies from site operators and updates structured state. Handles out-of-band messages, nudges stale distributions, sends confirmation loops. Makes the pantry-side loop work without a login.
2. **Routing suggestions (Abound-facing, operational).** When Abound posts a supply event, AI ranks candidate distributions by fit (storage match, timing, capacity, unmet need, travel distance, data freshness). Abound confirms or overrides.
3. **Gap and overlap detection (strategic).** AI scans the network continuously for coverage gaps and duplication overlaps, surfaces alerts in Abound and planner dashboards, composes the weekly strategic brief.
4. **Case-manager natural-language search (read-only).** Natural-language query to ranked distribution list with plain-English reasoning. On-demand.
5. **Data stewardship (passive, continuous).** Watches for stale profiles, flags unknown pantries it spots in partner data (211 OC, news mentions), suggests profile completions. Self-healing network.

All five are bounded LLM workflows, not custom ML. Built with the AI SDK + AI Gateway. Human-in-the-loop by default (AI proposes, human confirms) except for state updates driven by explicit user replies.

### 3.6 Product surfaces

**Abound console (desktop).** Single-pane dashboard as described in 3.4. Tabbed views for supply sources, full site directory, reports.

**Strategic dashboard (desktop).** Heat map, weekly brief, scenario tool, exports.

**Scenario planning tool (V1).** Planner selects 2+ distributions, proposes a consolidation (e.g., "merge three Saturday pantries into one choice market at FRC Saturdays 9am to noon"). Tool models projected family reach, walking-distance impact, supply-concentration effect, capacity utilization, wraparound-service gain. Before/after maps + plain-English summary. Saved scenarios can be shared with comments. Approved scenarios become migration plans that guide the transition over weeks.

**Case-manager search (responsive + PWA).** Natural-language input, ranked results, shareable links. Offline-capable search via PWA.

**Pantry web app (optional, mobile-responsive).** Visual alternative to email/SMS: map of nearby distributions, own history, permanent-profile edits. Never required.

**Public read-only map (on the platform's public surface).** Sanitized view with opt-in per site. Satisfies the "open infrastructure" grant story; partner agencies can embed.

**Public API + documentation.** REST + OpenAPI spec. Every data point available to partner tools, county agencies, future researchers.

### 3.7 Mobile strategy

- **Responsive web** for everything by default.
- **Progressive Web App (PWA)** for the case-manager search and the Abound field-staff app. One codebase (Next.js), installable to home screen, push notifications, offline-capable search. No App Store.
- **No true native (iOS/Android app store)** in V1. Estimated native cost ($80 to $150K build, $30K/yr maintenance) is explicitly deferred. If true native ever becomes necessary, it is a V2 additive.

### 3.8 Communication model

- **SMS** via Twilio (or similar) for site operators who prefer texts. TCPA-compliant opt-in at onboarding.
- **Email** via Resend (or similar) for site operators who prefer email, and for all long-form outputs (weekly briefs, digests).
- **In-app toasts + daily email digest** for Abound ops.
- **Weekly email brief** for Victoria and coalition members.
- Per-user, per-channel opt-in and opt-out.
- AI parser always runs through a confirmation reply so operators can see and correct before state commits.

### 3.9 V1 scope vs V2 stretch

**V1 (grant-funded build, $100–200K, roughly six months post-award).**

- Entity model: distribution sites, distributions, supply sources, supply events, transport, demand signals
- Conversational pantry loop (email + SMS + AI parsing, weekly cadence, mid-week alerts)
- Abound console (pipeline + calendar + routing queue + alerts)
- Strategic dashboard (heat map + weekly AI brief + scenario tool)
- Case-manager natural-language search
- PWA for case-manager search + Abound field staff
- Four AI pillars live (conversational, routing, gap/overlap, case-manager search). Fifth (stewardship) partial.
- Public read-only APIs + OpenAPI spec
- Public GitHub repo (MIT or Apache 2.0)
- SMS + email notifications with opt-in/opt-out
- Sanitized public read-only map (opt-in per site)

**V2 / stretch.**

- Full data stewardship AI (proactive pantry discovery from 211 OC, news, partner feeds)
- Scenario migration assistants (guided consolidation transitions)
- Deeper SNAP and school-roster integrations
- Partner webhook + subscription APIs
- Embeddable map widgets for partner sites
- True native mobile (case-manager) if demand warrants
- Grocery-store light portal (explicitly deferred; Abound maintains supply-source data in V1)
- Expansion beyond OC (forkable reference deployment is the path)

---

## 4. Proposal site design (what we build)

### 4.1 Goals

- Replace the 2-pager as the primary external artifact
- Demonstrate product craft (build quality proxy)
- Be reviewable on phone, desktop, and in a grant review meeting (projector)
- Work in under 3 seconds on a typical connection
- Be shareable via a single URL with no login

### 4.2 Hero

**Headline:**

> Shared food-rescue data for Orange County.

**Subline:**

> Open directory. Live distribution state. Public APIs. Built with Abound Food Care.

**Hero visual:** Interactive map of Anaheim, CA with representative distribution-site dots. Not full OC (tightens build scope and matches the Anaheim pilot footprint in the grant narrative). Filter chips below the map (e.g., "open today · cold storage · choice market · needs dry goods"). Tooltip on hover for each dot showing representative name, schedule, capacity, current needs. The tooltip explicitly says "representative demo data; live coordination layer in development."

**Primary CTA:** "Read the proposal" (scroll anchor or PDF download).
**Secondary CTA:** "How it works" (scroll to section 3).

### 4.3 Site section structure (top to bottom)

1. **Hero** (4.2)
2. **The problem** — one concrete micro-story (Saturday morning in central Anaheim with three overlapping pantries), not bullet soup. Anchor the reader emotionally.
3. **The picture** — Strategic Planner view walked through. What Victoria sees, what Mike acts on, what the AI surfaces weekly. Lead narrative.
4. **Coordination without login** — the conversational pantry pillar with a screenshot of a real text exchange.
5. **The live state** — distribution calendar + map + routing queue, what Abound opens every morning.
6. **A door for every family** — case-manager search, minute-by-minute human story.
7. **Public infrastructure** — open source, public APIs, any county can fork. The anti-Second-Harvest position (named by differentiation, not by calling them out).
8. **Who's building this** — Abound + Victoria + Datawake. Three names, three specific roles, no corporate blur.
9. **V1 scope, timeline, budget** — what's committed. Honest numbers.
10. **What's next** — CTA. For Victoria: "give feedback." For Mike: "let's talk before May 15."

Hero and "What's next" bookend the page; sections 2 through 9 stack.

### 4.4 Per-section copy shape

Full copy is drafted at plan/build time. The shape per section:

- **Section 2 (Problem):** 80–150 words of single-story narrative + a small inline map cutout showing the overlap. No bullets.
- **Section 3 (Strategic Planner view, lead):** 150–250 words + a hero screenshot of the heat map / weekly brief / scenario tool. Walk through what Victoria does once per week.
- **Section 4 (Conversational pantry loop):** 100–150 words + a text-message-style visual of Karen's weekly reply exchange. One sentence on the AI adoption story ("operators never leave their inbox").
- **Section 5 (Live state):** 100–150 words + Abound console screenshot, highlighting supply-pipeline column, calendar, routing queue.
- **Section 6 (Case-manager search):** 80–120 words + mobile screenshot of the NL-search UI with a worked query and ranked results.
- **Section 7 (Public infrastructure):** 80–120 words + a small code snippet or OpenAPI-style block. Says "GitHub · OpenAPI · MIT or Apache 2.0 · any county can fork."
- **Section 8 (Who's building):** Three small cards. Abound (product owner, grant applicant, long-term operator). AMDC / Victoria (co-PM, domain expert, adoption lead). Datawake (builder, maintainer). Portraits or logos only.
- **Section 9 (Scope + timeline + budget):** Small honest numbers. Budget stated as "$100–200K build, ~$100K maintenance over 3 years" to match the 2-pager and the grant narrative. See open question #8 re: whether to revise the stated range upward given scenario tool + PWA now in V1. Timeline anchored to grant-award-date + ~6 months MVP.
- **Section 10 (CTA):** A short direct ask. Email link for Victoria, email link for Mike, calendar link for a call.

No counts in the hero. Internal sections can cite specific examples (e.g., "three pantries on the same block Saturday 9am") but without totaling counts we cannot confirm.

### 4.5 Design direction (C: Data-Forward)

Reference set: Our World in Data, The Pudding, USAFacts.

Principles:

- **The data is the argument.** Maps, charts, and real (or clearly representative) data are the primary content, not decoration.
- **Typography drives hierarchy.** One primary contrast between headline and body. Small labels in uppercase letter-spaced. Numbers get their own typographic treatment (larger weight, tighter line-height, sometimes color).
- **Color is meaning.** Teal for primary data and UI chrome. Gold for flagged or callout states (overlaps, high-need alerts, CTAs). Neutrals everywhere else.
- **Whitespace is content.** Generous section padding. No decorative filler.
- **Interaction is honest.** Hoverable map dots, filterable chips, scroll-linked map states. No parallax-for-parallax, no scroll-jacking, no confetti.

Anti-patterns to avoid in **rendered site output** (AI-slop checklist, enforced at review). This spec document itself may use em dashes for internal narrative clarity; the rule applies to user-facing copy:

- No em dashes as clause separators in any user-facing copy
- No banned SaaS vocabulary: "empower", "leverage" (verb), "unlock", "transform your", "seamlessly", "game-changer", "move the needle", "unleash", "in today's fast-paced world"
- No purple-to-pink gradients, no 3D blobs, no AI stock photography
- No emoji bullet icons, no lucide-react icon spam
- No "trusted by" logo grid without real named partners
- No seven competing type sizes; one primary contrast
- No uncited claims ("AI-powered" without a named mechanism)
- No fake numbers; representative data is labeled as such

### 4.6 Visual system

**Colors (from Datawake brand guide `/Users/dustin/projects/dw-marketing/brand/brand-guide.md`):**

- Primary: `#0C7C8A` (teal)
- Primary Dark: `#085A66`
- Primary Light: `#E8F5F7`
- Accent: `#D4A843` (warm gold)
- Gold Dark: `#92710A`
- Gold Light: `#FFF8E7`
- Neutrals: text `#1A1A1A`, heading `#1C2D3A`, muted `#6B7280`, border `#E2E8F0`, background `#F7F9FA`, white `#FFFFFF`
- Status: success `#10B981`, warning `#D4A843`, error `#E05252`

**Typography:** DM Sans via `@next/font` or Google Fonts. Fallback stack `'DM Sans', Arial, Helvetica, sans-serif`.

Scale:
- H1 hero: 48–56px on desktop, 36–40px on mobile, weight 700, letter-spacing -0.5px
- H2 section: 32–36px desktop, 24–28px mobile, weight 700
- H3 subsection: 20–22px, weight 600
- Body: 16px, line-height 1.6
- Small / labels: 13–14px, weight 500, uppercase-tracked for meta labels
- Numbers (data-forward specific): 28–40px, weight 700, teal or gold when meaningful, muted neutral when context

**Components:** shadcn/ui as the base (Button, Card, Badge, Tooltip, Sheet). Custom `InteractiveMap` component wrapping MapLibre GL JS (see 5.3). All components typed with TypeScript.

**Spacing:** Tailwind default scale (4/8/12/16/24/32/48/64/96/128). Section vertical rhythm: 96–128px desktop, 64–80px mobile.

### 4.7 Interaction and motion

- **Framer Motion** used sparingly for scroll-reveal of section headings and data blocks. No mandatory long animations.
- **Map:** MapLibre GL JS with OSM (or a Mapbox token if already provisioned for Datawake). Anaheim bounds, max-zoom limited. Dots are `CircleLayer` with data-driven styling. Hover shows a `Popup`. Filter chips update a feature-filter.
- **Reduced-motion:** respect `prefers-reduced-motion`. All animations gracefully disable.
- **Keyboard:** every interactive element reachable via tab. Focus rings visible.

### 4.8 Accessibility

- WCAG AA contrast minimum. Test all teal/gold combinations.
- Semantic HTML. Landmarks.
- Alt text on all non-decorative images.
- Map alternate: every section with a map has a text summary of what the map shows.
- Responsive down to 375px width.

### 4.9 Non-goals

- Not a product-marketing site for Datawake.
- Not a self-service onboarding site (pantries don't sign up here).
- Not an interactive product demo (clickthroughs beyond the hero map).
- Not an anonymous-visitor analytics or conversion funnel.
- Not a blog, changelog, or ongoing content property.
- Not multilingual (v1). Spanish and Vietnamese are worth considering for V2 given OC demographics; surface the question with Victoria.

---

## 5. Technical setup

### 5.1 Repo and Drive integration

- **Source code:** `/Users/dustin/projects/clients/prospects/Abound/Proposal/`
- **Drive symlink:** A symlink at `/Users/dustin/Library/CloudStorage/GoogleDrive-dustin@datawake.io/Shared drives/Prospects/Abound/Proposal` pointing to the source path above. Victoria and Dustin see the Proposal folder in Drive; Dustin develops in the source path locally, no Drive sync of `node_modules`.
- `.gitignore`: `.superpowers/`, `node_modules/`, `.next/`, `.env*.local`.
- `.superpowers/` holds brainstorm session files (HTML mockups from visual companion).

### 5.2 Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (single `globals.css` with `@theme`), shadcn/ui components, custom CSS variables for Datawake brand colors
- **Font:** DM Sans via `next/font/google`
- **Map:** MapLibre GL JS (open) or Mapbox GL JS (if a token is already provisioned). Default: MapLibre with OpenStreetMap tiles.
- **Motion:** Framer Motion (sparingly)
- **Deployment:** Vercel, linked project, previews on push, production on main
- **Package manager:** pnpm
- **Linting:** ESLint + Prettier, shadcn-standard config

### 5.3 Map data approach

- **Bounds:** Anaheim, CA. Roughly `[-118.05, 33.79]` to `[-117.70, 33.89]` (city boundary). Max-zoom constrained so the map stays informative.
- **Representative points:** ~15–25 distribution-site dots with plausible names (e.g., "St. Mark's Community Pantry", "Magnolia Elementary Food Shelf", "Love Anaheim Distribution (Tue)"), storage metadata, schedules, and current state. Stored as a static `GeoJSON` file in `public/data/anaheim-distributions.geojson`. Clearly labeled as representative in accompanying copy.
- **Filter chips:** "Open today", "Has cold storage", "Choice market", "Needs dry goods", "Overlap flagged". Toggle `data-filter` on the MapLibre layer.
- **Tooltip on dot-hover:** site name, type (pantry / FRC / school / mobile / appointment), next distribution date+time, capacity status, storage badges, specific needs.
- **One "overlap" cluster** pre-highlighted in gold to make the problem visible at first glance.

### 5.4 Environment variables and keys

- `NEXT_PUBLIC_MAP_STYLE_URL` (MapLibre tile style URL) — no key required if we use OSM-compatible tiles; if Mapbox, `NEXT_PUBLIC_MAPBOX_TOKEN`
- No other secrets required for V1 (no auth, no DB, no payments, no analytics in V1)

### 5.5 Deploy target

- **Vercel project:** linked to a new project named `abound-pantry-proposal` (rename-friendly). Preview deployments for every push. Production deploys on `main`.
- **Custom domain:** optional. Default is the Vercel preview URL for V1. If Dustin wants a branded domain, options: `proposal.ocpantry.network` (requires domain acquisition) or `abound-pantry.datawake.io` (Datawake subdomain). Defer decision to post-V1.

---

## 6. Build pipeline

1. **This spec** (done, awaiting Dustin review)
2. **Writing-plans skill** produces implementation plan with 2–5 minute tasks
3. **Cross-AI review of the plan** (Codex + optional Gemini) per CLAUDE.md checkpoint rule
4. **Worktree** via `superpowers:using-git-worktrees` before touching code
5. **Build pass** invokes `frontend-design`, `shadcn-radix-tailwind`, and `high-end-visual-design` skills. Dustin confirmed at brainstorm time: "Claude design" = use those design skills for the real visual pass, not hand-authored Tailwind.
6. **Subagent-driven development** per CLAUDE.md: one task per fresh subagent, two-stage review
7. **Verification-before-completion** before claiming done: actually run the dev server and view each section
8. **Deploy to Vercel**; capture preview URL
9. **Update email draft to Victoria** to replace the 2-pager link with the site URL. 2-pagers become secondary PDFs.
10. **Victoria review → Mike review** via existing email thread

## 7. Open questions and deferred items

1. **Vercel account:** which account hosts the project? Datawake org, or a new one for this engagement? (Defaults to Datawake if not specified.)
2. **Custom domain:** none in V1 per 5.5. Reopen if site goes long-lived.
3. **Spanish/Vietnamese translation:** V2 consideration given OC demographics; confirm with Victoria whether the proposal itself should be bilingual.
4. **Map provider:** MapLibre (free, OSM) vs Mapbox (prettier tiles, needs token). Default MapLibre unless Datawake has a Mapbox token to spare.
5. **Logo placement:** Datawake lockup in the header vs. co-branded "Abound × Datawake" lockup vs. "Built with Abound Food Care" text treatment only. Confirm with Dustin.
6. **Open-Source license:** MIT vs Apache 2.0 for the future product. Stated as "MIT or Apache 2.0" in copy; pick one before public repo.
7. **Hero overlap gold-cluster copy:** exact caption language to avoid overclaiming. Options: "Representative overlap" vs "Saturday 9am cluster (representative)".
8. **Budget number in section 9:** $100–200K (per 2-pager) vs $150–200K (after scenario tool + PWA moved in). Flag for Dustin to confirm before site goes to Victoria.
9. **Hero "Ten coordinating agencies" earlier flag:** Resolved by dropping counts from the hero entirely.
10. **Alliance naming in copy:** When referring to the OC Hunger Alliance, confirm whether to name it explicitly (helps grant narrative) or describe it without naming (Victoria political judgment call).

## 8. Success criteria

- Victoria reviews the deployed site before 2026-04-28 and approves (with or without edits).
- Mike reviews the polished version before the 2026-05-05 09:00 PT call and the call uses the site as the primary artifact.
- The site loads in under 3 seconds on a typical mobile connection.
- The hero map renders and is interactive on a grant-reviewer projector.
- Zero AI-slop-checklist violations at final review (6.x section 4.5).
- The site has zero typos, zero broken links, and every claim has a source or is labeled "representative."
- The deployed Vercel URL is linked into the Drive `Prospects/Abound/Proposal` folder.
- Memory file `/Users/dustin/.claude/projects/-Users-dustin-projects-clients/memory/project_abound_feed_oc.md` is updated with the deployed URL and the fact that the 2-pagers are now secondary.

## 9. Change log

- **2026-04-22 (draft v1).** Initial spec synthesized from brainstorming session. Locked: two-sided live loop, distribution-event as unit, Abound as supply-side coordinator, five AI pillars, conversational pantry loop (no login), PWA for case-manager and Abound-field personas, scenario tool in V1, strategic-planner lead narrative, data-forward design direction, H1 hero (no counts), Anaheim-bounded map with representative data.
