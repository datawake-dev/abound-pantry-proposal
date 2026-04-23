import { Snowflake, Package } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.6 — Strategic Planner view, lead narrative.
 * Asymmetric split, scenario tool mock on the right.
 */

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

            {/* Right column — scenario tool mock */}
            <ScrollReveal
              delayMs={100}
              className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-6 ss-float-card">
                <header className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--rule-cool)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {copy.scenario.heading}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    Representative
                  </span>
                </header>

                <fieldset className="mt-5">
                  <legend className="sr-only">Candidate pantries for consolidation</legend>
                  <p className="mb-3 text-[11px] font-medium text-[var(--ink-muted)]">
                    Pantries to consolidate
                  </p>
                  <div className="space-y-2">
                    {copy.scenario.pantries.map((p, i) => (
                      <label
                        key={p.name}
                        className="flex items-start gap-3 rounded-lg border border-[var(--rule-cool)] bg-[var(--surface-card)] p-3 transition-colors hover:border-[var(--brand-primary)]"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={i < 2}
                          className="mt-1 h-4 w-4 accent-[var(--brand-primary)]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[var(--ink)]">
                            {p.name}
                          </p>
                          <p className="text-[11.5px] text-[var(--ink-muted)] tabular">
                            {p.time}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule-cool)] px-2 py-0.5 text-[10.5px] text-[var(--ink-muted)]">
                          {p.storage.includes("cold") ? (
                            <Snowflake weight="light" className="h-2.5 w-2.5" aria-hidden />
                          ) : null}
                          {p.storage.includes("dry") || p.storage.toLowerCase().includes("dry") ? (
                            <Package weight="light" className="h-2.5 w-2.5" aria-hidden />
                          ) : null}
                          {p.storage}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-[11px] font-medium text-[var(--ink-muted)]">
                    Proposed
                  </legend>
                  <label className="flex items-start gap-3 rounded-lg bg-[var(--brand-primary-light)] p-3">
                    <input
                      type="radio"
                      name="proposed"
                      defaultChecked
                      className="mt-1 h-4 w-4 accent-[var(--brand-primary)]"
                    />
                    <p className="text-[13px] font-medium text-[var(--brand-primary-dark)]">
                      {copy.scenario.proposed}
                    </p>
                  </label>
                </fieldset>

                <div className="mt-5" data-testid="scenario-metrics">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    Projected impact
                  </p>
                  <ul className="space-y-3">
                    {copy.scenario.metrics.map((metric, i) => {
                      // Deterministic representative widths — not computed, just
                      // visual hierarchy. The "(representative)" label is the
                      // honest signal that these aren't live numbers.
                      const widths = [64, 72, 48];
                      return (
                        <li key={metric.label} className="flex items-center gap-3">
                          <span className="w-[120px] text-[11.5px] text-[var(--ink)]">
                            {metric.label}
                          </span>
                          <div className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-[var(--brand-primary)]"
                              style={{ width: `${widths[i] ?? 50}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                            {metric.detail}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--rule-cool)] pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-cool)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  >
                    {copy.scenario.compareLabel}
                  </button>
                  <p className="max-w-[200px] text-right text-[10.5px] text-[var(--ink-faint)]">
                    {copy.scenario.disclaimer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
      </div>
    </section>
  );
}
