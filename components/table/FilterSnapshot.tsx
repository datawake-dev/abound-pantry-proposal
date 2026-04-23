"use client";
import type { CapacityLabel, DistributionFeatureProperties } from "@/lib/map-data";
import { useFilterContext } from "@/lib/filter-context";

const FILTER_LABELS: Record<string, string> = {
  "open-today": "Open today",
  "cold-storage": "Cold storage",
  "choice-market": "Choice market",
  "needs-dry-goods": "Needs dry goods",
  "overlap-flagged": "Overlap flagged",
};

const CAPACITY_ORDER: CapacityLabel[] = ["open", "partial", "full", "closed"];
const CAPACITY_LABEL: Record<CapacityLabel, string> = {
  open: "Open",
  partial: "Partial",
  full: "Full",
  closed: "Closed",
};
const CAPACITY_COLOR: Record<CapacityLabel, string> = {
  open: "var(--status-open)",
  partial: "var(--status-partial)",
  full: "var(--status-full)",
  closed: "var(--status-closed)",
};

export interface FilterSnapshotProps {
  /**
   * Rows returned by the DataTable's getFilteredRowModel. The component
   * renders metrics over THIS set, not the full population — so "N of total"
   * and the capacity bars always reflect current filter state.
   */
  rows: DistributionFeatureProperties[];
  total: number;
}

export function FilterSnapshot({ rows, total }: FilterSnapshotProps) {
  const { state } = useFilterContext();
  const shown = rows.length;

  const capacityCounts: Record<CapacityLabel, number> = {
    open: 0,
    partial: 0,
    full: 0,
    closed: 0,
  };
  for (const r of rows) {
    capacityCounts[r.capacityLabel]++;
  }

  return (
    <aside
      aria-label="Filter snapshot"
      className="p-1.5 rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] ring-1 ring-[rgba(10,10,11,0.06)]"
    >
      <div className="rounded-[calc(1.75rem-0.375rem)] bg-white p-5 ss-float-card">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Filter state
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {state.active.size === 0 ? (
            <span className="text-[12px] text-[var(--ink-faint)]">No filters active</span>
          ) : (
            [...state.active].map((key) => (
              <span
                key={key}
                className="inline-flex items-center rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-[11px] text-white"
              >
                {FILTER_LABELS[key] ?? key}
              </span>
            ))
          )}
        </div>

        <div className="mt-6">
          <p className="font-[var(--font-sans)] text-[1.75rem] font-semibold leading-none tracking-tight text-[var(--brand-primary)] tabular">
            {shown}
            <span className="ml-2 text-[0.95rem] font-normal text-[var(--ink-muted)]">
              of {total} sites match
            </span>
          </p>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Capacity distribution
          </p>
          <ul className="mt-3 space-y-2" data-testid="capacity-bars">
            {CAPACITY_ORDER.map((cap) => {
              const count = capacityCounts[cap];
              const pct = shown > 0 ? (count / shown) * 100 : 0;
              return (
                <li key={cap} className="flex items-center gap-3">
                  <span className="w-[58px] text-[11px] text-[var(--ink-muted)]">
                    {CAPACITY_LABEL[cap]}
                  </span>
                  <div
                    className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]"
                    role="presentation"
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CAPACITY_COLOR[cap],
                      }}
                    />
                  </div>
                  <span className="tabular w-6 text-right text-[11px] text-[var(--ink)]">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
