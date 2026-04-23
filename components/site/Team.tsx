"use client";
import { LazyMotion, domAnimation, m } from "motion/react";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.11 — Z-Axis Cascade with 3 partner cards: rotation + overlap
 * desktop, flat stacked mobile. Datawake card copy is the PLAN-REVISIONS
 * flattened string (already in SITE.team.partners).
 */

const ROTATIONS = ["-1.5deg", "1deg", "-0.5deg"];
const INITIALS_STYLES: Record<string, { bg: string; fg: string }> = {
  AFC: { bg: "var(--brand-gold-light)", fg: "var(--brand-gold-dark)" },
  AMDC: { bg: "var(--brand-primary-light)", fg: "var(--brand-primary-dark)" },
  DW: { bg: "#0F0F11", fg: "#FFFFFF" },
};

export default function Team() {
  const copy = SITE.team;

  return (
    <section
      id="team"
      aria-labelledby="team-h2"
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
              id="team-h2"
              className="mt-5 max-w-[640px] text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              {copy.headline}
            </h2>
          </m.div>

          <ul
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)] lg:gap-4"
            data-testid="team-cards"
          >
            {copy.partners.map((partner, i) => {
              const initialsStyle =
                INITIALS_STYLES[partner.initials] ?? INITIALS_STYLES.DW;
              return (
                <li key={partner.name} className="relative">
                  <m.article
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="group relative rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)] lg:-ml-3 transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      transform: `rotate(var(--card-rotate, 0deg))`,
                    }}
                    data-rotate={ROTATIONS[i]}
                  >
                    <div
                      className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-6 ss-float-card"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          aria-hidden
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-semibold uppercase tracking-[0.12em]"
                          style={{
                            backgroundColor: initialsStyle.bg,
                            color: initialsStyle.fg,
                          }}
                        >
                          {partner.initials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[1.125rem] font-semibold leading-tight text-[var(--ink)]">
                            {partner.name}
                          </h3>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                            {partner.role}
                          </p>
                        </div>
                      </div>
                      <p
                        className="mt-5 text-[14px] text-[var(--ink-muted)]"
                        style={{ lineHeight: 1.55, fontFamily: "var(--font-body)" }}
                      >
                        {partner.body}
                      </p>
                    </div>

                    <style>{`
                      @media (min-width: 1024px) {
                        [data-rotate="${ROTATIONS[i]}"] {
                          --card-rotate: ${ROTATIONS[i]};
                        }
                      }
                    `}</style>
                  </m.article>
                </li>
              );
            })}
          </ul>
        </LazyMotion>
      </div>
    </section>
  );
}
