import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.7 — conversational pantry loop.
 * Asymmetric split; text exchange visual on the right in Double-Bezel styled
 * as a phone portrait.
 */

export default function Coordination() {
  const copy = SITE.coordination;

  return (
    <section
      id="coordination"
      aria-labelledby="coordination-h2"
      className="relative overflow-hidden bg-[var(--surface-muted)] py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <ScrollReveal>
              <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
                />
                {copy.eyebrow}
              </span>
              <h2
                id="coordination-h2"
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

            {/* Right — text exchange */}
            <ScrollReveal
              delayMs={120}
              className="mx-auto w-full max-w-[380px] rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-5 ss-float-card">
                <header className="flex items-center justify-between pb-4 border-b border-[var(--rule-cool)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {copy.exchangeLabel}
                  </p>
                </header>

                <ol
                  className="mt-4 space-y-3"
                  data-testid="chat-bubbles"
                >
                  {copy.bubbles.map((bubble, i) => (
                    <li
                      key={i}
                      className={
                        bubble.speaker === "operator" ? "flex justify-end" : "flex"
                      }
                    >
                      <div
                        className={
                          bubble.speaker === "operator"
                            ? "max-w-[85%] rounded-[18px] rounded-br-[6px] bg-[var(--brand-primary)] px-3.5 py-2 text-white"
                            : "max-w-[85%] rounded-[18px] rounded-bl-[6px] border border-[var(--rule-cool)] bg-[var(--surface-card)] px-3.5 py-2 text-[var(--ink)]"
                        }
                      >
                        <p
                          className="text-[13px]"
                          style={{ lineHeight: 1.45, fontFamily: "var(--font-body)" }}
                        >
                          {bubble.text}
                        </p>
                        <p
                          className={
                            bubble.speaker === "operator"
                              ? "mt-1 text-right text-[10.5px] font-medium text-white"
                              : "mt-1 text-[10.5px] text-[var(--ink-muted)]"
                          }
                        >
                          {bubble.author}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>
          </div>
      </div>
    </section>
  );
}
