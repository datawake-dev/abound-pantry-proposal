"use client";
// React Compiler escape hatch per shadcn-radix-tailwind guidance — TanStack
// Table's useReactTable returns stateful functions that cannot be memoized
// safely by React Compiler. Keep the whole file out of compiler-memo.
"use no memo";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { CaretUp, CaretDown, ArrowLineDown } from "@phosphor-icons/react/dist/ssr";
import type { DistributionFeature, DistributionFeatureProperties } from "@/lib/map-data";
import { applyFilters } from "@/lib/map-filters";
import { useFilterContext } from "@/lib/filter-context";
import { columns } from "./columns";
import { FilterSnapshot } from "./FilterSnapshot";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * DataTable — DESIGN.md §7.4 and §8.
 *
 * TanStack v8, wrapped in Double-Bezel, consumes FilterContext for both
 * filtering (rows narrow via applyFilters) and bidirectional cross-hover
 * (mouseenter/focus on a row sets highlightedId → InteractiveMap renders a
 * ring on the matching dot; the inverse fires from map hover too).
 *
 * Filter chips are NOT composed here — per DESIGN.md §8.4 the chip surface
 * lives once in SharedDatabase (Task 13), above the table. The map and the
 * table both read the single FilterContext state.
 */

export interface DataTableProps {
  /** Full, unfiltered feature list from the parent Server Component. */
  features: DistributionFeature[];
}

export function DataTable({ features }: DataTableProps) {
  const { state, highlightedId, setHighlightedId } = useFilterContext();
  const [sorting, setSorting] = useState<SortingState>([]);

  const total = features.length;

  const filteredData = useMemo<DistributionFeatureProperties[]>(
    () => applyFilters(features, state).map((f) => f.properties),
    [features, state],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's useReactTable is not compiler-memoizable; we mitigate via the file-level "use no memo" directive above.
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const shown = filteredData.length;

  return (
    <figure className="flex flex-col">
      <div className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] ring-1 ring-[rgba(10,10,11,0.06)] p-1.5">
        <div className="rounded-[calc(1.75rem-0.375rem)] bg-white overflow-hidden ss-float-card">
          <div
            role="region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {shown === total
              ? `${total} sites shown.`
              : `${shown} of ${total} sites shown. ${state.active.size} filter${state.active.size === 1 ? "" : "s"} active.`}
          </div>

          <div
            className="relative max-h-[460px] overflow-auto"
            data-testid="table-scroll"
          >
            <table
              role="table"
              className="w-full border-collapse text-[13px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <thead className="sticky top-0 z-10 bg-[var(--surface-card)] shadow-[0_1px_0_var(--rule-cool)]">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sort = header.column.getIsSorted();
                      const ariaSort =
                        sort === "asc"
                          ? "ascending"
                          : sort === "desc"
                            ? "descending"
                            : "none";
                      return (
                        <th
                          key={header.id}
                          aria-sort={ariaSort}
                          scope="col"
                          style={{ width: header.column.columnDef.size }}
                          className={cn(
                            "px-3 py-2.5 text-left font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]",
                            canSort && "cursor-pointer select-none hover:text-[var(--brand-primary)]",
                          )}
                          onClick={
                            canSort ? header.column.getToggleSortingHandler() : undefined
                          }
                          onKeyDown={(e) => {
                            if (!canSort) return;
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              header.column.toggleSorting();
                            }
                          }}
                          tabIndex={canSort ? 0 : undefined}
                        >
                          <span className="inline-flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort ? (
                              sort === "asc" ? (
                                <CaretUp weight="light" className="h-3 w-3" aria-hidden />
                              ) : sort === "desc" ? (
                                <CaretDown weight="light" className="h-3 w-3" aria-hidden />
                              ) : (
                                <span
                                  aria-hidden
                                  className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-30"
                                />
                              )
                            ) : null}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const isOverlap = row.original.isOverlap;
                  const isHighlighted = highlightedId === row.original.id;
                  return (
                    <tr
                      key={row.id}
                      tabIndex={0}
                      data-row-id={row.original.id}
                      data-overlap={isOverlap ? "true" : "false"}
                      data-highlighted={isHighlighted ? "true" : "false"}
                      onMouseEnter={() => setHighlightedId(row.original.id)}
                      onMouseLeave={() => setHighlightedId(null)}
                      onFocus={() => setHighlightedId(row.original.id)}
                      onBlur={() => setHighlightedId(null)}
                      className={cn(
                        "border-b border-[var(--rule-cool)] transition-colors duration-[160ms] outline-none focus-visible:bg-[rgba(12,124,138,0.08)]",
                        "hover:bg-[rgba(12,124,138,0.04)]",
                        isOverlap && "border-l-4 border-l-[var(--brand-gold)] bg-[rgba(212,168,67,0.04)]",
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-[var(--ink-muted)]">
        <span className="tabular">
          <span data-testid="footer-count">
            {shown} of {total} sites
          </span>
          {state.active.size > 0 ? (
            <>
              {" · "}
              <span>Filtered: {state.active.size}</span>
            </>
          ) : null}
        </span>
        <button
          type="button"
          aria-label="Export filtered rows as CSV (mock, V1 will implement)"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule-cool)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
          onClick={() => {
            /* Export CSV is a V1 capability; the button signals the data is
             * queryable, but the proposal site itself is static. */
          }}
        >
          Export CSV
          <ArrowLineDown weight="light" className="h-3 w-3" aria-hidden />
        </button>
      </figcaption>
    </figure>
  );
}

export { FilterSnapshot };
