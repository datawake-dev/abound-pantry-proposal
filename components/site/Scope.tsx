"use client";
import { LazyMotion, domAnimation, m } from "motion/react";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.12 — Asymmetrical Bento: scope bullets 8 col, timeline + budget
 * stacked in 4 col. Budget numbers in Display S Geist teal (§2.2 scale).
 */

export default function Scope() {
  const copy = SITE.scope;

  return (
    <section
      id="scope"
      aria-labelledby="scope-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
              <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]" />
              {copy.eyebrow}
            </span>
            <h2
              id="scope-h2"
              className="mt-5 max-w-[640px] text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              {copy.headline}
            </h2>
          </m.div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-12">
            {/* Scope bullets — left 8 col */}
            <ul className="space-y-5" data-testid="scope-bullets">
              {copy.bullets.map((item) => (
                <li
                  key={item.label}
                  className="border-l-2 border-[var(--brand-primary)] pl-4"
                >
                  <p className="text-[1rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                    {item.label}
                  </p>
                  <p
                    className="mt-1 text-[14px] text-[var(--ink-muted)]"
                    style={{ lineHeight: 1.55, fontFamily: "var(--font-body)" }}
                  >
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>

            {/* Right 4 col — timeline + budget */}
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Timeline
                </p>
                <dl
                  className="mt-4 space-y-3"
                  data-testid="scope-timeline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {copy.timeline.map((row) => (
                    <div
                      key={row.when}
                      className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-0 border-b border-[var(--rule-cool)] pb-3 last:border-b-0"
                    >
                      <dt className="font-medium text-[13px] text-[var(--ink)] tabular">
                        {row.when}
                      </dt>
                      <dd className="text-[13px] text-[var(--ink-muted)]">
                        {row.what}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]">
                <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-6 ss-float-card">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Budget
                  </p>
                  <p
                    className="mt-4 text-[clamp(1.5rem,2.4vw,1.875rem)] font-semibold leading-none tracking-[-0.025em] text-[var(--brand-primary)] tabular"
                    data-testid="budget-build"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {copy.budget.build}
                  </p>
                  <p
                    className="mt-3 text-[clamp(1.5rem,2.4vw,1.875rem)] font-semibold leading-none tracking-[-0.025em] text-[var(--brand-primary)] tabular"
                    data-testid="budget-maintenance"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {copy.budget.maintenance}
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    {copy.budget.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
