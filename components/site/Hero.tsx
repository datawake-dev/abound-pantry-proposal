"use client";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { LazyMotion, domAnimation, m } from "motion/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { DistributionFeature } from "@/lib/map-data";
import { useFilterContext } from "@/lib/filter-context";
import { applyFilters, type FilterKey } from "@/lib/map-filters";
import { SITE } from "@/lib/site-data";

const FILTER_LABEL: Record<FilterKey, string> = {
  "open-today": "Capacity open",
  "cold-storage": "Cold storage",
  "choice-market": "Choice market",
  "needs-dry-goods": "Needs dry goods",
  "overlap-flagged": "Overlap flagged",
};

function deriveCaption(
  activeFilters: Set<FilterKey>,
  filteredCount: number,
  totalCount: number,
): { metric: string; body: string } {
  if (activeFilters.size === 0) {
    return {
      metric: SITE.hero.overlapCaption.metric,
      body: SITE.hero.overlapCaption.body,
    };
  }
  const labels = Array.from(activeFilters).map((k) => FILTER_LABEL[k]);
  const metric =
    activeFilters.size === 1
      ? labels[0]
      : `${activeFilters.size} filters · ${labels.join(" + ")}`;
  const plural = filteredCount === 1 ? "site" : "sites";
  const body =
    filteredCount === 0
      ? `No ${plural} match right now. Adjust filters below.`
      : `${filteredCount} of ${totalCount} ${plural} match. Adjust filters below.`;
  return { metric, body };
}

// Defer MapLibre GL JS out of the initial bundle. The hero reveal timeline
// fades the map in at t=600ms anyway (DESIGN.md §5.5 step 6), so pushing the
// ~160KB MapLibre chunk past LCP is consistent with the orchestration.
const InteractiveMap = dynamic(
  () => import("@/components/map/InteractiveMap").then((m) => m.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="p-1.5 rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] ring-1 ring-[rgba(10,10,11,0.06)]">
        <div
          className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-muted)] ss-float-card"
          style={{ aspectRatio: "16 / 9", minHeight: "360px" }}
          aria-hidden
        />
      </div>
    ),
  },
);

const EASE_EDITORIAL = [0.32, 0.72, 0, 1] as const;

export default function Hero({ features }: { features: DistributionFeature[] }) {
  const copy = SITE.hero;
  const { state } = useFilterContext();
  const caption = useMemo(
    () =>
      deriveCaption(state.active, applyFilters(features, state).length, features.length),
    [state, features],
  );

  return (
    <section
      id="hero"
      aria-labelledby="hero-h1"
      className="relative overflow-hidden pt-16 pb-18 md:pt-16 md:pb-16"
    >
      <div className="atmosphere-teal" aria-hidden />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <LazyMotion features={domAnimation}>
          <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
            {/* Left column — headline block */}
            <div className="relative">
              <m.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.1, ease: EASE_EDITORIAL }}
                className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]"
              >
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
                />
                {copy.eyebrow}
              </m.span>

              {/*
                H1 uses a CSS animation (defined inline below) rather than a
                Motion initial={opacity:0}. The H1 is the page's LCP element;
                Motion's initial state would paint opacity:0 on SSR and block
                LCP by the full delay+duration (~1s). Keeping opacity:1 from
                first paint lets LCP fire immediately while a transform+blur
                still carries the reveal feeling.
              */}
              <h1
                id="hero-h1"
                className="hero-h1-reveal mt-5 text-[clamp(2.8rem,5.2vw,4.25rem)] font-semibold leading-[1.0] tracking-[-0.04em]"
              >
                {copy.headline.map((seg, i) => (
                  <span
                    key={i}
                    className={seg.accent === "teal" ? "text-[var(--brand-primary)]" : undefined}
                  >
                    {seg.text}
                  </span>
                ))}
              </h1>

              <m.p
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.56, delay: 0.38, ease: EASE_EDITORIAL }}
                className="mt-5 max-w-[48ch] text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--ink-muted)]"
                style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
              >
                <span className="font-semibold text-[var(--ink)]">{copy.subline.lead}</span>
                <span>{copy.subline.rest}</span>
              </m.p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {copy.ctas.map((cta, i) => (
                  <m.a
                    key={cta.href}
                    href={cta.href}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.42,
                      delay: 0.5 + i * 0.04,
                      ease: EASE_EDITORIAL,
                    }}
                    className={
                      cta.variant === "primary"
                        ? "group inline-flex items-center gap-2.5 rounded-full bg-[var(--brand-primary)] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_-4px_rgba(12,124,138,0.42),0_1px_2px_rgba(12,124,138,0.18)] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--brand-primary-dark)] active:scale-[0.98]"
                        : "group inline-flex items-center gap-2.5 rounded-full border border-[rgba(10,10,11,0.14)] pl-6 pr-2.5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-all duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] active:scale-[0.98]"
                    }
                    style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                  >
                    <span>{cta.label}</span>
                    <span
                      className={
                        cta.variant === "primary"
                          ? "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/20 transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-white/30"
                          : "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--brand-primary-light)] transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px] group-hover:scale-105"
                      }
                    >
                      {cta.variant === "primary" ? (
                        <ArrowRight weight="light" className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <ArrowDown
                          weight="light"
                          className="h-3.5 w-3.5 text-[var(--brand-primary)]"
                          aria-hidden
                        />
                      )}
                    </span>
                  </m.a>
                ))}
              </div>
            </div>

            {/* Right column — interactive map with gold overlap caption */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE_EDITORIAL }}
              className="relative"
            >
              <InteractiveMap features={features} />

              {/* Gold overlap caption — reveals at t≈1800ms per DESIGN.md §5.5 step 9 */}
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 1.8, ease: EASE_EDITORIAL }}
                role="note"
                aria-label="Overlap caption"
                className="pointer-events-none absolute left-6 bottom-20 max-w-[320px] rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)]/92 p-4 ss-float-card"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-gold-light)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--brand-gold-dark)]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]"
                  />
                  {caption.metric}
                </span>
                <p
                  className="mt-2 text-[13px] text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {caption.body}
                </p>
              </m.div>
            </m.div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
