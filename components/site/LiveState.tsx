import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.8 — Abound console mock.
 * Single column, full-width console at max-w-[1100px], 3-column interior with
 * teal/neutral/gold accents (Supply · Calendar · Routing Queue).
 */

const ACCENT: Record<string, { dot: string; bg: string }> = {
  teal: { dot: "var(--brand-primary)", bg: "rgba(12,124,138,0.08)" },
  neutral: { dot: "var(--ink-muted)", bg: "var(--surface-muted)" },
  gold: { dot: "var(--brand-gold)", bg: "var(--brand-gold-light)" },
};

export default function LiveState() {
  const copy = SITE.liveState;

  return (
    <section
      id="live-state"
      aria-labelledby="live-state-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
          <ScrollReveal className="max-w-[780px]">
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
              <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]" />
              {copy.eyebrow}
            </span>
            <h2
              id="live-state-h2"
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

          <ScrollReveal
            delayMs={100}
            rootMargin="-60px 0px"
            className="mt-12 mx-auto max-w-[1100px] rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
          >
            <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] overflow-hidden ss-float-card">
              {/* Window chrome — macOS-style but muted (not red/yellow/green) */}
              <div
                className="flex items-center justify-between gap-3 border-b border-[var(--rule-cool)] bg-[var(--surface-muted)] px-5 py-3"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--ink-faint)]" />
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--rule-cool)]" />
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--rule-cool)]" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)] tabular">
                  {copy.timestamp}
                </p>
                <div className="w-[46px]" aria-hidden />
              </div>

              <div
                className="grid grid-cols-1 divide-y divide-[var(--rule-cool)] md:grid-cols-3 md:divide-x md:divide-y-0"
                data-testid="console-columns"
              >
                {copy.columns.map((col) => (
                  <div key={col.label} className="p-5">
                    <p
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em]"
                      style={{
                        color: ACCENT[col.accent].dot,
                        backgroundColor: ACCENT[col.accent].bg,
                      }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: ACCENT[col.accent].dot }}
                      />
                      {col.label}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {col.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-[var(--rule-cool)] bg-[var(--surface-card)] px-3 py-2 text-[12.5px] text-[var(--ink)] transition-colors hover:bg-[rgba(12,124,138,0.04)]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <p className="mt-4 max-w-[1100px] mx-auto font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            {copy.caption}
          </p>
      </div>
    </section>
  );
}
