import { ArrowRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.13 — full-bleed deep-teal CTA band.
 *
 * Gold primary CTA is the documented exception to the "gold = semantic only"
 * rule from §3.2 — on deep-teal surface, teal-on-teal would vanish, so gold is
 * the anchor by necessity.
 */

export default function CTA() {
  const copy = SITE.cta;

  return (
    <section
      id="cta-band"
      aria-labelledby="cta-h2"
      className="relative overflow-hidden bg-[var(--brand-primary-dark)] py-32 md:py-40 text-[var(--surface-paper)]"
    >
      {/* Subtle inner radial — teal → slightly-darker teal toward corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(12, 124, 138, 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6 text-center">
          <ScrollReveal>
            <span
              className="inline-flex items-center gap-[7px] rounded-full border border-[var(--brand-gold-light)]/40 bg-[var(--brand-gold-light)]/10 px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-gold-light)]"
            >
              <span
                aria-hidden
                className="h-[5px] w-[5px] rounded-full bg-[var(--brand-gold)]"
              />
              {copy.eyebrow}
            </span>

            <h2
              id="cta-h2"
              className="mt-5 text-[clamp(2.4rem,4.5vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--surface-paper)]"
            >
              {copy.headline}
            </h2>

            <p
              className="mx-auto mt-5 max-w-[52ch] text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--surface-paper)]/85"
              style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
            >
              {copy.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {copy.ctas.map((cta) => {
                const isGold = cta.variant === "gold";
                const Icon = cta.href.startsWith("mailto") ? ArrowRight : CalendarBlank;
                return (
                  <a
                    key={cta.href}
                    href={cta.href}
                    className={
                      isGold
                        ? "group inline-flex items-center gap-2.5 rounded-full bg-[var(--brand-gold)] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_4px_14px_-4px_rgba(212,168,67,0.4),0_1px_2px_rgba(212,168,67,0.18)] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-[1.05] active:scale-[0.98]"
                        : "group inline-flex items-center gap-2.5 rounded-full border border-white/30 pl-6 pr-2.5 py-2.5 text-sm font-semibold text-[var(--surface-paper)] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/70 hover:bg-white/10 active:scale-[0.98]"
                    }
                    style={{
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span>{cta.label}</span>
                    <span
                      className={
                        isGold
                          ? "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--ink)]/10 transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-[var(--ink)]/20"
                          : "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/15 transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-white/25"
                      }
                    >
                      <Icon weight="light" className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
      </div>
    </section>
  );
}
