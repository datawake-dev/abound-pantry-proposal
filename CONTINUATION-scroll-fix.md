# Continuation: scroll-to-top still not working on production

## Paste this as the first prompt in a fresh Claude Code session

---

You are picking up from a previous session on the OC Pantry Coordination proposal site. I need a fresh diagnosis. The previous agent tried three fixes and the bug persists. Please do not guess; investigate with browser DevTools and repo evidence before proposing another fix.

**Working directory:** `/Users/dustin/projects/clients/prospects/Abound/Proposal`
**Production URL:** https://abound-pantry-proposal.vercel.app
**Repo:** github.com/datawake-dev/abound-pantry-proposal (public)
**Stack:** Next.js 16.2.4 App Router on Vercel, Turbopack, React 19.2.4
**Main branch auto-deploys to Vercel.**

### The bug

On return visits in Chrome desktop, the deployed page opens scrolled partway down, landing roughly at the LiveState section (`TUE APR 28 · 7:42 AM PT`) instead of at the hero. The URL bar shows no hash fragment. The page should always open at the hero when the URL has no hash.

### What has already been tried (all failed to fully resolve)

1. **Client component effect.** `<ScrollRestoration />` in `components/ui/ScrollRestoration.tsx` calls `history.scrollRestoration = "manual"` and `window.scrollTo(0, 0)` in `useEffect`. Failed because `useEffect` runs after first paint.

2. **`next/script` with `strategy="beforeInteractive"`.** Expected Next to inject a raw inline script tag. Verified in deployed HTML that Next actually pushed the body onto `self.__next_s` and evaluated it after the main chunk loaded — too late.

3. **Raw inline script tag in `<head>`.** Current implementation in `app/layout.tsx` uses a plain inline script element pointing at a literal `SCROLL_RESET_SCRIPT` constant. Verified present in the deployed HTML by curl. Still reportedly broken per user screenshot.

### Current state in the repo

**`app/layout.tsx`:** has the `SCROLL_RESET_SCRIPT` constant containing `"try{if('scrollRestoration' in history){history.scrollRestoration='manual'}if(!location.hash){window.scrollTo(0,0)}}catch(e){}"` and inlines it in `<head>` via a plain script element.

**`components/ui/ScrollRestoration.tsx`:** useEffect re-asserts `scrollRestoration = "manual"` and listens for `pageshow` with `event.persisted === true` (bfcache restores).

Both verified rendering in the deployed HTML via `curl | grep scrollRestoration`.

### Hypotheses worth investigating in order

1. **Chrome tab-level scroll state override.** Chrome may have a tab-session mechanism that restores scroll position after page load even when `scrollRestoration = 'manual'` is set. Test: open the URL in a fresh incognito window versus the existing tab.

2. **Service worker caching old HTML.** Previous session shipped three fixes in rapid succession; if any prior build registered a service worker, the browser could be serving cached pre-fix HTML. Check DevTools > Application > Service Workers for any registered worker on the domain.

3. **Browser scroll restoration runs after the HTML parse script.** Even inline head scripts execute during parse, but the browser's scroll-restore step may fire on the `load` event or later, overwriting the `scrollTo(0,0)` call. Add a scroll event listener and log each scroll with a timestamp to see the sequence.

4. **Font or CSS layout shift.** The hero H1 has a reveal animation and below-fold sections use `<ScrollReveal>` (opacity 0 to 1 via IntersectionObserver). Normally this should not move the viewport, but confirm via `window.scrollY` snapshots across ticks.

5. **Hidden hash in URL.** The address bar could be truncating `#live-state` or similar. Run `location.hash` in DevTools and report the exact value.

6. **CDN serving older build.** Verify the latest commit is live: `curl -sI https://abound-pantry-proposal.vercel.app/ | grep x-vercel-id` and compare against `vercel ls --scope datawake-vb | head -3`.

### What to do (in this order)

1. **Reproduce first.** Use `mcp__claude-in-chrome` or Playwright to open the URL in a fresh tab. Report `window.scrollY` immediately after load. If it is 0, the bug may already be resolved from the user's perspective after a hard refresh.

2. **Check in DevTools:**
   - Is a service worker registered? If yes, unregister and reload.
   - What is `location.hash` when the page first loads? Empty string or an actual fragment?
   - Add a console.log inside the inline head script and a `window.addEventListener('scroll', () => console.log('scroll', performance.now(), window.scrollY))` to see the full timing sequence.
   - Any console errors about CSP blocking the inline script? Check Network tab for HTML response headers.

3. **Only propose a fix after logs confirm a specific cause.** Do not skip to speculative fix #4. The user is out of patience with guessing.

4. **Stronger remedies to consider if you confirm the browser is restoring scroll after the current script runs:**
   - Repeatedly call `scrollTo(0, 0)` on each `requestAnimationFrame` for the first 500ms after load
   - Apply CSS `html { overflow: hidden }` briefly on first visit then release via JS
   - Save `scrollY=0` to sessionStorage on `beforeunload`

5. **After the fix, verify on the live deployed URL:**
   - Hard-refresh the existing tab — does it load at top?
   - Fresh incognito window — does it load at top?
   - Click a nav link like "Planner view" — does it scroll to that section?
   - Browser back button — does it still land at top?

### Guardrails

- Preserve all 298 passing tests; update any test that legitimately changes with the fix.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` must stay clean.
- Do NOT regress the narrative copy rewrite, the Team vertical list, the hero heat map layer, the 71-site dataset, or the new "it's a demo" disclaimers. Those are all recent work that shipped correctly.
- Commit with conventional prefix (`fix(scroll):`) and the standard `Co-Authored-By` trailer for Claude.
- Push to `main` after each commit. Main auto-deploys on Vercel.

### Relevant files

- `app/layout.tsx` — inline head script lives here
- `components/ui/ScrollRestoration.tsx` — post-hydration effect and pageshow listener
- `components/site/Hero.tsx` — uses Motion; possible layout-shift contributor
- `components/ui/ScrollReveal.tsx` — IntersectionObserver-driven opacity transitions on every below-fold section
- `next.config.ts` — check for any scroll-related experimental flags

### Last three commits

```
8bd4077 copy(disclaimers): make the demo nature unambiguous across the page
77a08ac fix(scroll): switch from next/script to a raw inline <script> in <head>
99a0ef0 refactor(copy): rewrite bodies as connected prose; redesign team; fix scroll; drop footer credit
```

Start by reproducing with a browser, not by reading code. The bug is behavioral, not visible in the source.
