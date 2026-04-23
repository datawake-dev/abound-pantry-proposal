"use client";
import { LazyMotion, domAnimation, m } from "motion/react";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.5 — single-column editorial, bg-surface-muted, max-w-[680px].
 * Distinctive element: inline SVG cutout of Lincoln Ave overlap cluster
 * (right-floated on desktop, centered full-width on mobile).
 */

const LINCOLN_CLUSTER_POINTS: Array<[number, number]> = [
  [38, 52], // First Baptist Lincoln
  [44, 48], // St. Luke's Lutheran
  [34, 46], // Community Presbyterian
];

function LincolnCutout() {
  return (
    <svg
      role="img"
      aria-labelledby="lincoln-cutout-title lincoln-cutout-desc"
      viewBox="0 0 220 160"
      className="block h-full w-full"
    >
      <title id="lincoln-cutout-title">Lincoln Ave overlap cluster</title>
      <desc id="lincoln-cutout-desc">
        Three pantries on the same block in East Anaheim, all serving Saturday 9 am.
      </desc>

      {/* Background — paper-tone rectangle representing the map tile */}
      <rect width="220" height="160" fill="#FCFBF8" />

      {/* Faint street grid — horizontal Lincoln Ave + cross streets */}
      <g stroke="#E6E5E0" strokeWidth="1">
        <line x1="0" y1="50" x2="220" y2="50" />
        <line x1="0" y1="100" x2="220" y2="100" />
        <line x1="60" y1="0" x2="60" y2="160" />
        <line x1="120" y1="0" x2="120" y2="160" />
        <line x1="180" y1="0" x2="180" y2="160" />
      </g>

      {/* Lincoln Ave label */}
      <text
        x="10"
        y="44"
        fill="#5F6875"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="8"
        letterSpacing="1.2"
      >
        LINCOLN AVE
      </text>

      {/* Three overlapping pantry dots — gold */}
      {LINCOLN_CLUSTER_POINTS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x + 60} cy={y + 50} r="7" fill="#D4A843" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx={x + 60} cy={y + 50} r="14" fill="none" stroke="#D4A843" strokeOpacity="0.25" strokeWidth="1" />
        </g>
      ))}

      {/* Caption — "SAT 9 AM" */}
      <text
        x="120"
        y="130"
        fill="#856708"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        fontSize="8"
        letterSpacing="1.4"
        textAnchor="middle"
      >
        SAT 9 AM · 3 PANTRIES · 300 M
      </text>
    </svg>
  );
}

export default function Problem() {
  const copy = SITE.problem;

  return (
    <section
      id="problem"
      aria-labelledby="problem-h2"
      className="relative overflow-hidden bg-[var(--surface-muted)] py-24 md:py-28"
    >
      <div className="relative mx-auto max-w-[1100px] px-6">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="mx-auto max-w-[680px]"
          >
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
              <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]" />
              {copy.eyebrow}
            </span>

            <h2
              id="problem-h2"
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              {copy.headline}
            </h2>

            <div className="mt-6 md:float-right md:ml-6 md:mb-2 md:w-[240px] w-full">
              <div className="mx-auto w-full max-w-[280px] rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)] ss-float-card">
                <div className="rounded-[calc(1.75rem-0.75rem)] overflow-hidden bg-[var(--surface-card)]">
                  <LincolnCutout />
                </div>
              </div>
            </div>

            <p
              className="mt-6 text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--ink)]"
              style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
            >
              {copy.body}
            </p>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  );
}
