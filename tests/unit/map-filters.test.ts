import { describe, expect, test } from "vitest";
import type { DistributionFeature } from "@/lib/map-data";
import {
  applyFilters,
  countActive,
  createEmptyFilterState,
  toggleFilter,
} from "@/lib/map-filters";

/**
 * RED-first tests for DESIGN.md §7.3 filter chips:
 * Open today · Cold storage · Choice market · Needs dry goods · Overlap flagged
 *
 * Fixtures span the 5 distribution types + all filter dimensions so each filter
 * can be asserted in isolation and combined filters are AND-composed (stricter).
 */

function feature(id: string, props: Partial<DistributionFeature["properties"]> = {}): DistributionFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [-117.9, 33.85] },
    properties: {
      id,
      name: `Site ${id}`,
      neighborhood: "Central Anaheim",
      type: "pantry",
      nextDistribution: "Sat 9–11 am",
      nextDistributionIso: "2026-04-25T09:00:00-07:00",
      storage: ["dry"],
      model: "box",
      capacityLabel: "open",
      specificNeeds: [],
      isOverlap: false,
      ...props,
    },
  };
}

const fixtures: DistributionFeature[] = [
  // 1: open today, dry only, box, no overlap
  feature("a", { capacityLabel: "open", storage: ["dry"], model: "box" }),
  // 2: partial, cold + dry, choice, needs dry goods via "protein"
  feature("b", {
    capacityLabel: "partial",
    storage: ["dry", "cold"],
    model: "choice",
    specificNeeds: ["protein", "infant formula"],
  }),
  // 3: open, cold only, choice, no dry need
  feature("c", {
    capacityLabel: "open",
    storage: ["cold"],
    model: "choice",
    specificNeeds: ["fresh produce"],
  }),
  // 4: full, dry only, box, explicit "dry goods" in needs
  feature("d", {
    capacityLabel: "full",
    storage: ["dry"],
    model: "box",
    specificNeeds: ["dry goods"],
  }),
  // 5: closed, dry, box
  feature("e", { capacityLabel: "closed", storage: ["dry"], model: "box" }),
  // 6: open, dry + cold, choice, overlap-flagged
  feature("f", {
    capacityLabel: "open",
    storage: ["dry", "cold"],
    model: "choice",
    specificNeeds: ["protein"],
    isOverlap: true,
  }),
];

describe("FilterState helpers", () => {
  test("createEmptyFilterState has an empty active Set", () => {
    const s = createEmptyFilterState();
    expect(s.active.size).toBe(0);
  });

  test("toggleFilter adds a key when absent, removes it when present", () => {
    const s = createEmptyFilterState();
    const s1 = toggleFilter(s, "open-today");
    expect(s1.active.has("open-today")).toBe(true);
    const s2 = toggleFilter(s1, "open-today");
    expect(s2.active.has("open-today")).toBe(false);
  });

  test("countActive returns the number of active keys", () => {
    let s = createEmptyFilterState();
    s = toggleFilter(s, "open-today");
    s = toggleFilter(s, "cold-storage");
    expect(countActive(s)).toBe(2);
  });
});

describe("applyFilters — single filter", () => {
  test("empty state returns all features", () => {
    const out = applyFilters(fixtures, createEmptyFilterState());
    expect(out.length).toBe(fixtures.length);
  });

  test("open-today keeps only capacityLabel=open", () => {
    const s = toggleFilter(createEmptyFilterState(), "open-today");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id).sort()).toEqual(["a", "c", "f"]);
  });

  test("cold-storage keeps only sites with cold storage", () => {
    const s = toggleFilter(createEmptyFilterState(), "cold-storage");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id).sort()).toEqual(["b", "c", "f"]);
  });

  test("choice-market keeps only model=choice", () => {
    const s = toggleFilter(createEmptyFilterState(), "choice-market");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id).sort()).toEqual(["b", "c", "f"]);
  });

  test("needs-dry-goods keeps sites whose specificNeeds signal dry-good restock", () => {
    const s = toggleFilter(createEmptyFilterState(), "needs-dry-goods");
    const out = applyFilters(fixtures, s);
    // b: "protein" + "infant formula"; d: explicit "dry goods"; f: "protein".
    expect(out.map((f) => f.properties.id).sort()).toEqual(["b", "d", "f"]);
  });

  test("overlap-flagged keeps only isOverlap=true", () => {
    const s = toggleFilter(createEmptyFilterState(), "overlap-flagged");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id)).toEqual(["f"]);
  });
});

describe("applyFilters — combined filters are AND (stricter)", () => {
  test("open-today + cold-storage narrows to sites matching BOTH", () => {
    let s = createEmptyFilterState();
    s = toggleFilter(s, "open-today");
    s = toggleFilter(s, "cold-storage");
    const out = applyFilters(fixtures, s);
    // c: open + cold only; f: open + dry/cold + overlap.
    expect(out.map((f) => f.properties.id).sort()).toEqual(["c", "f"]);
  });

  test("choice-market + overlap-flagged narrows to overlap choice markets", () => {
    let s = createEmptyFilterState();
    s = toggleFilter(s, "choice-market");
    s = toggleFilter(s, "overlap-flagged");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id)).toEqual(["f"]);
  });

  test("all five filters stacked match only f in this fixture", () => {
    let s = createEmptyFilterState();
    s = toggleFilter(s, "open-today");
    s = toggleFilter(s, "cold-storage");
    s = toggleFilter(s, "choice-market");
    s = toggleFilter(s, "needs-dry-goods");
    s = toggleFilter(s, "overlap-flagged");
    const out = applyFilters(fixtures, s);
    expect(out.map((f) => f.properties.id)).toEqual(["f"]);
  });
});
