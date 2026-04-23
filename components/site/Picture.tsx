import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.6 — Strategic Planner view, lead narrative.
 * Asymmetric split, heat-map density visual + AI nudge panel on the right.
 *
 * Replaces the prior "scenario tool" checkbox/radio mockup. The new visual is
 * two stacked cards in a Double-Bezel shell:
 *   1. Heat map: 12x8 grid of teal cells with graduated alpha showing
 *      Saturday-9am coverage density. No real projection math — deterministic
 *      intensity values chosen to read as "dense cluster in the center, thin
 *      on the edges" so a reviewer sees the pattern at a glance.
 *   2. AI nudge panel: the planner-facing recommendation card. Three bullets,
 *      each tagging a specific pantry with a specific action. The CTA frames
 *      it as a conversation, not a directive — matches the "No forced
 *      consolidation" pledge in the body copy.
 */

// Deterministic density grid. 8 rows × 12 cols = 96 cells. Values 0–3 map to
// alpha steps so the central Anaheim cluster reads dense against the edges.
const DENSITY_GRID = [
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 3, 2, 1, 1, 0, 0, 0],
  [0, 1, 1, 2, 3, 3, 3, 2, 1, 1, 0, 0],
  [0, 1, 2, 3, 3, 3, 3, 2, 1, 1, 1, 0],
  [0, 0, 1, 2, 2, 3, 2, 2, 1, 1, 0, 0],
  [0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
] as const;

// rgba(12, 124, 138, α) — brand primary teal with graduated alpha
const DENSITY_ALPHA = [0.04, 0.22, 0.5, 0.82] as const;

export default function Picture() {
  const copy = SITE.picture;

  return (
    <section
      id="picture"
      aria-labelledby="picture-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          {/* Left column — copy */}
          <ScrollReveal>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
              <span
                aria-hidden
                className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
              />
              {copy.eyebrow}
            </span>
            <h2
              id="picture-h2"
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              {copy.headline}
            </h2>
            <p
              className="mt-6 max-w-[58ch] text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--ink-muted)]"
              style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
            >
              {copy.body}
            </p>
          </ScrollReveal>

          {/* Right column — heat map + nudge stack */}
          <ScrollReveal
            delayMs={100}
            className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
          >
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-6 ss-float-card space-y-5">
              {/* Heat-map card */}
              <div data-testid="heat-map">
                <header className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--rule-cool)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {copy.heatMap.heading}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    {copy.heatMap.overlayLabel}
                  </span>
                </header>

                <div
                  className="relative mt-4 overflow-hidden rounded-[14px] bg-[var(--surface-muted)] ring-1 ring-[var(--rule-cool)]"
                  role="img"
                  aria-label="Density heat map showing Saturday 9am distribution overlap in central Anaheim"
                >
                  <div
                    className="grid aspect-[3/2]"
                    style={{
                      gridTemplateColumns: "repeat(12, 1fr)",
                      gridTemplateRows: "repeat(8, 1fr)",
                    }}
                  >
                    {DENSITY_GRID.flatMap((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          style={{
                            backgroundColor: `rgba(12, 124, 138, ${DENSITY_ALPHA[cell]})`,
                          }}
                        />
                      )),
                    )}
                  </div>

                  {/* Central cluster marker — the three overlapping pantries */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute h-3 w-3 rounded-full bg-[var(--brand-gold)] ring-4 ring-[var(--brand-gold-light)]"
                    style={{ left: "calc(42% - 6px)", top: "calc(45% - 6px)" }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  <span>{copy.heatMap.legendLow}</span>
                  <div
                    aria-hidden
                    className="flex-1 mx-3 h-1.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(12, 124, 138, 0.05), rgba(12, 124, 138, 0.82))",
                    }}
                  />
                  <span>{copy.heatMap.legendHigh}</span>
                </div>

                <p className="mt-3 text-right text-[10.5px] text-[var(--ink-faint)]">
                  {copy.heatMap.disclaimer}
                </p>
              </div>

              {/* AI nudge panel */}
              <div
                className="rounded-[14px] border border-[var(--brand-primary)]/18 bg-[var(--brand-primary-light)]/40 p-4"
                data-testid="ai-nudge"
              >
                <header className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]"
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--brand-primary-dark)]">
                    {copy.nudge.heading}
                  </p>
                </header>

                <p
                  className="mt-3 text-[13px] text-[var(--ink)]"
                  style={{ lineHeight: 1.5, fontFamily: "var(--font-body)" }}
                >
                  {copy.nudge.summary}
                </p>

                <ul
                  className="mt-4 space-y-2"
                  data-testid="nudge-actions"
                >
                  {copy.nudge.actions.map((a) => (
                    <li
                      key={a.site}
                      className="rounded-lg border border-[var(--rule-cool)] bg-[var(--surface-card)] p-3"
                    >
                      <p className="text-[12.5px] font-semibold text-[var(--ink)]">
                        {a.site}
                      </p>
                      <p
                        className="mt-0.5 text-[12px] text-[var(--ink-muted)]"
                        style={{ lineHeight: 1.5, fontFamily: "var(--font-body)" }}
                      >
                        {a.action}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] pl-4 pr-1.5 py-1.5 text-[12px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_6px_-2px_rgba(12,124,138,0.35)] transition-all duration-[240ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--brand-primary-dark)] active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                  >
                    <span>{copy.nudge.ctaLabel}</span>
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/22 transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:scale-105">
                      <ArrowRight weight="light" className="h-3 w-3" aria-hidden />
                    </span>
                  </button>
                </div>

                <p
                  className="mt-3 text-[11px] text-[var(--ink-muted)]"
                  style={{ lineHeight: 1.5, fontFamily: "var(--font-body)" }}
                >
                  {copy.nudge.rationale}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
