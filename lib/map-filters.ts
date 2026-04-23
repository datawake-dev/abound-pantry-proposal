import type { DistributionFeature } from "@/lib/map-data";

/**
 * DESIGN.md §7.3 filter chips — 5 filters, AND-composed (stricter when more
 * active). Used by both InteractiveMap (via MapLibre setFilter) and DataTable
 * (via TanStack's getFilteredRowModel), sharing state through FilterContext.
 */
export type FilterKey =
  | "open-today"
  | "cold-storage"
  | "choice-market"
  | "needs-dry-goods"
  | "overlap-flagged";

export interface FilterState {
  active: Set<FilterKey>;
}

// Keywords that signal a pantry is asking for dry-good restock. Matched case-
// insensitively against each entry in specificNeeds.
const DRY_GOODS_KEYWORDS = [
  "dry goods",
  "protein",
  "canned",
  "pasta",
  "beans",
  "rice",
  "cereal",
  "grain",
  "infant formula",
];

/**
 * Derive whether a pantry is asking for dry-goods restock from its
 * specificNeeds list. Shared between applyFilters (used by DataTable + the
 * keyboard list) and InteractiveMap (pre-computed into source properties so a
 * single MapLibre filter expression can narrow the dots). Keeping both
 * filters reading the same boolean prevents the "table filtered, map still
 * shows everything" split-state bug.
 */
export function computeNeedsDryGoods(specificNeeds: string[]): boolean {
  const needs = specificNeeds.map((n) => n.toLowerCase());
  return needs.some((n) => DRY_GOODS_KEYWORDS.some((kw) => n.includes(kw)));
}

export function createEmptyFilterState(): FilterState {
  return { active: new Set() };
}

export function toggleFilter(state: FilterState, key: FilterKey): FilterState {
  const next = new Set(state.active);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return { active: next };
}

export function countActive(state: FilterState): number {
  return state.active.size;
}

function matchesFilter(feature: DistributionFeature, key: FilterKey): boolean {
  const p = feature.properties;
  switch (key) {
    case "open-today":
      return p.capacityLabel === "open";
    case "cold-storage":
      return p.storage.includes("cold");
    case "choice-market":
      return p.model === "choice";
    case "needs-dry-goods":
      return computeNeedsDryGoods(p.specificNeeds);
    case "overlap-flagged":
      return p.isOverlap;
  }
}

/**
 * Apply the active filters to the feature collection. AND-composed: when
 * multiple filters are active, a feature must match all of them.
 */
export function applyFilters(
  features: DistributionFeature[],
  state: FilterState,
): DistributionFeature[] {
  if (state.active.size === 0) return features;
  return features.filter((f) => {
    for (const key of state.active) {
      if (!matchesFilter(f, key)) return false;
    }
    return true;
  });
}
