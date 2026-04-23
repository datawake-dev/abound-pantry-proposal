"use client";
import { useMemo } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { FilterChips } from "@/components/map/FilterChips";
import { DataTable } from "@/components/table/DataTable";
import { FilterSnapshot } from "@/components/table/FilterSnapshot";
import { useFilterContext } from "@/lib/filter-context";
import { applyFilters } from "@/lib/map-filters";
import { SITE } from "@/lib/site-data";
import type { DistributionFeature } from "@/lib/map-data";

export default function SharedDatabase({ features }: { features: DistributionFeature[] }) {
  const { state, toggle } = useFilterContext();

  // Filter once at the section level so DataTable, FilterSnapshot, and this
  // component all agree on the row set. DataTable still applies its own
  // applyFilters internally for sort + cell rendering; this derivation is
  // the authoritative source for FilterSnapshot metrics.
  const filteredRows = useMemo(
    () => applyFilters(features, state).map((f) => f.properties),
    [features, state],
  );

  const copy = SITE.sharedDatabase;

  return (
    <section
      id="shared-database"
      aria-labelledby="shared-database-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="atmosphere-teal" aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-[640px]"
          >
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
              <span
                aria-hidden
                className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
              />
              {copy.eyebrow}
            </span>
            <h2
              id="shared-database-h2"
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              {copy.headline.map((seg, i) => (
                <span
                  key={i}
                  className={seg.accent === "teal" ? "text-[var(--brand-primary)]" : undefined}
                >
                  {seg.text}
                </span>
              ))}
            </h2>
            <p
              className="mt-4 max-w-[58ch] text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--ink-muted)]"
              style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
            >
              {copy.body}
            </p>
          </m.div>
        </LazyMotion>

        <div className="mt-10">
          <FilterChips state={state} onToggle={toggle} label={copy.filterLabel} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <DataTable features={features} />
          <div className="hidden lg:block">
            <FilterSnapshot rows={filteredRows} total={features.length} />
          </div>
        </div>

        <ul
          className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]"
          data-testid="shared-database-hints"
        >
          {copy.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
