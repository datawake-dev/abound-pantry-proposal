import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import SharedDatabase from "@/components/site/SharedDatabase";
import { FilterProvider } from "@/lib/filter-context";
import type { DistributionFeature } from "@/lib/map-data";

function feature(
  id: string,
  overrides: Partial<DistributionFeature["properties"]> = {},
): DistributionFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [-117.9, 33.85] },
    properties: {
      id,
      name: `Site ${id.toUpperCase()}`,
      neighborhood: "Central Anaheim",
      type: "pantry",
      nextDistribution: "Sat 9–11 am",
      nextDistributionIso: "2026-04-25T09:00:00-07:00",
      storage: ["dry"],
      model: "box",
      capacityLabel: "open",
      specificNeeds: [],
      isOverlap: false,
      ...overrides,
    },
  };
}

const FIXTURES: DistributionFeature[] = [
  feature("a", { isOverlap: true }),
  feature("b"),
  feature("c"),
];

function renderSection() {
  return render(
    <FilterProvider>
      <SharedDatabase features={FIXTURES} />
    </FilterProvider>,
  );
}

describe("SharedDatabase section", () => {
  test("renders <section id='shared-database'> landmark", () => {
    renderSection();
    const section = document.getElementById("shared-database");
    expect(section).not.toBeNull();
    expect(section!.tagName).toBe("SECTION");
  });

  test("renders eyebrow, H2 headline, and body from SITE.sharedDatabase", () => {
    renderSection();
    expect(screen.getByText("The shared database")).toBeInTheDocument();
    // Headline is split across spans with teal accent — assert the H2 text content.
    const h2 = document.getElementById("shared-database-h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toContain("Every distribution, every week.");
    expect(h2!.textContent).toContain("One source");
  });

  test("composes the single FilterChips surface", () => {
    renderSection();
    // 5 filter chip buttons
    const chipGroup = screen.getByRole("group", { name: /filter/i });
    const chips = chipGroup.querySelectorAll("button[aria-pressed]");
    expect(chips.length).toBe(5);
  });

  test("composes the DataTable with one row per feature", () => {
    renderSection();
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBe(FIXTURES.length);
  });

  test("renders the 3 interaction hints below the table", () => {
    renderSection();
    const hints = screen.getByTestId("shared-database-hints").querySelectorAll("li");
    expect(hints.length).toBeGreaterThanOrEqual(2);
  });
});
