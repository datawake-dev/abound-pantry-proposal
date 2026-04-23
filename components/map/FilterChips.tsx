"use client";
import { X } from "@phosphor-icons/react/dist/ssr";
import type { FilterKey, FilterState } from "@/lib/map-filters";

/**
 * DESIGN.md §7.3 filter chips.
 *
 * Shared between the hero InteractiveMap and the SharedDatabase DataTable via
 * FilterContext (Task 11). This component is pure UI — it never mutates state
 * itself; it calls onToggle and reads from the state prop.
 *
 * Chip semantics:
 * - aria-pressed for toggle state (NOT role="switch" — a switch requires
 *   aria-checked, not aria-pressed).
 * - Active: teal bg, white text, inner highlight, Phosphor Light X glyph.
 * - Inactive: white bg, ink text, rule-cool ring, hover border → teal.
 */

const CHIP_ORDER: Array<{ key: FilterKey; label: string }> = [
  { key: "open-today", label: "Open today" },
  { key: "cold-storage", label: "Cold storage" },
  { key: "choice-market", label: "Choice market" },
  { key: "needs-dry-goods", label: "Needs dry goods" },
  { key: "overlap-flagged", label: "Overlap flagged" },
];

export interface FilterChipsProps {
  state: FilterState;
  onToggle: (key: FilterKey) => void;
  label?: string;
}

export function FilterChips({ state, onToggle, label = "Filter" }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {label}
      </span>
      {CHIP_ORDER.map(({ key, label: chipLabel }) => {
        const active = state.active.has(key);
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(key)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-[200ms]",
              active
                ? "bg-[var(--brand-primary)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(12,124,138,0.18)]"
                : "border border-[var(--rule-cool)] bg-[var(--surface-card)] text-[var(--ink)] hover:border-[var(--brand-primary)]",
            ].join(" ")}
            style={{
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span>{chipLabel}</span>
            {active ? (
              <X
                weight="light"
                className="h-3 w-3"
                aria-hidden
                data-slot="chip-close"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
