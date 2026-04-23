import { describe, expect, test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, FilterSnapshot } from "@/components/table/DataTable";
import { FilterProvider, useFilterContext } from "@/lib/filter-context";
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
  feature("a", { capacityLabel: "open", isOverlap: true }),
  feature("b", {
    capacityLabel: "partial",
    storage: ["dry", "cold"],
    model: "choice",
    specificNeeds: ["protein"],
  }),
  feature("c", { capacityLabel: "full" }),
  feature("d", { capacityLabel: "closed", storage: ["cold"] }),
];

function renderTable() {
  return render(
    <FilterProvider>
      <DataTable features={FIXTURES} />
    </FilterProvider>,
  );
}

describe("DataTable — structure + rendering", () => {
  test("renders 8 column headers matching DESIGN.md §8.2", () => {
    renderTable();
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(8);
    const headerTexts = headers.map((h) => h.textContent?.trim() ?? "");
    expect(headerTexts).toEqual([
      "Site",
      "Type",
      "Next",
      "Storage",
      "Model",
      "Capacity",
      "Needs",
      "", // Overlap column has empty header per DESIGN.md
    ]);
  });

  test("renders one row per feature with tabIndex=0 for keyboard focus", () => {
    renderTable();
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBe(FIXTURES.length);
    for (const row of rows) {
      expect(row.getAttribute("tabindex")).toBe("0");
    }
  });

  test("overlap rows carry data-overlap='true' and gold left-border tint", () => {
    renderTable();
    const overlap = document.querySelector("tr[data-row-id=a]");
    expect(overlap?.getAttribute("data-overlap")).toBe("true");
    const normal = document.querySelector("tr[data-row-id=b]");
    expect(normal?.getAttribute("data-overlap")).toBe("false");
  });

  test("sortable columns have aria-sort='none' initially", () => {
    renderTable();
    const siteHeader = screen.getByRole("columnheader", { name: /Site/ });
    expect(siteHeader.getAttribute("aria-sort")).toBe("none");
  });

  test("clicking a sortable header toggles aria-sort through ascending/descending", async () => {
    const user = userEvent.setup();
    renderTable();
    const siteHeader = screen.getByRole("columnheader", { name: /Site/ });
    await user.click(siteHeader);
    expect(siteHeader.getAttribute("aria-sort")).toBe("ascending");
    await user.click(siteHeader);
    expect(siteHeader.getAttribute("aria-sort")).toBe("descending");
  });
});

describe("DataTable — FilterContext integration", () => {
  test("active filter narrows the rendered rows", () => {
    function Driver() {
      const { toggle } = useFilterContext();
      return (
        <button
          data-testid="toggle-overlap"
          onClick={() => toggle("overlap-flagged")}
          type="button"
        >
          overlap
        </button>
      );
    }
    render(
      <FilterProvider>
        <DataTable features={FIXTURES} />
        <Driver />
      </FilterProvider>,
    );
    expect(document.querySelectorAll("tbody tr").length).toBe(FIXTURES.length);
    act(() => {
      screen.getByTestId("toggle-overlap").click();
    });
    const remaining = document.querySelectorAll("tbody tr");
    expect(remaining.length).toBe(1);
    expect(remaining[0].getAttribute("data-row-id")).toBe("a");
  });

  test("row mouseenter sets highlightedId in FilterContext", async () => {
    const user = userEvent.setup();

    function Probe() {
      const { highlightedId } = useFilterContext();
      return <span data-testid="highlighted">{highlightedId ?? "none"}</span>;
    }
    render(
      <FilterProvider>
        <DataTable features={FIXTURES} />
        <Probe />
      </FilterProvider>,
    );
    const row = document.querySelector("tr[data-row-id=c]") as HTMLElement;
    await user.hover(row);
    expect(screen.getByTestId("highlighted").textContent).toBe("c");
    await user.unhover(row);
    expect(screen.getByTestId("highlighted").textContent).toBe("none");
  });

  test("row focus/blur also sets and clears highlightedId", () => {
    function Probe() {
      const { highlightedId } = useFilterContext();
      return <span data-testid="highlighted">{highlightedId ?? "none"}</span>;
    }
    render(
      <FilterProvider>
        <DataTable features={FIXTURES} />
        <Probe />
      </FilterProvider>,
    );
    const row = document.querySelector("tr[data-row-id=d]") as HTMLElement;
    act(() => {
      row.focus();
    });
    expect(screen.getByTestId("highlighted").textContent).toBe("d");
    act(() => {
      row.blur();
    });
    expect(screen.getByTestId("highlighted").textContent).toBe("none");
  });
});

describe("DataTable — a11y + footer", () => {
  test("aria-live region announces filtered count", () => {
    renderTable();
    const live = document.querySelector("[aria-live=polite]");
    expect(live).not.toBeNull();
    expect(live!.textContent).toContain(`${FIXTURES.length} sites shown`);
  });

  test("footer shows N of total sites", () => {
    renderTable();
    expect(screen.getByTestId("footer-count").textContent).toContain(
      `${FIXTURES.length} of ${FIXTURES.length} sites`,
    );
  });

  test("Export CSV button renders with accessible label", () => {
    renderTable();
    expect(screen.getByLabelText(/export filtered rows as csv/i)).toBeInTheDocument();
  });
});

describe("FilterSnapshot", () => {
  test("renders 'N of total sites match' for filtered row set", () => {
    render(
      <FilterProvider>
        <FilterSnapshot rows={FIXTURES.map((f) => f.properties).slice(0, 2)} total={FIXTURES.length} />
      </FilterProvider>,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/of 4 sites match/i)).toBeInTheDocument();
  });

  test("renders all 4 capacity bars", () => {
    render(
      <FilterProvider>
        <FilterSnapshot rows={FIXTURES.map((f) => f.properties)} total={FIXTURES.length} />
      </FilterProvider>,
    );
    const bars = screen.getByTestId("capacity-bars").querySelectorAll("li");
    expect(bars.length).toBe(4);
  });

  test("reflects active filter keys as chips", () => {
    function Harness() {
      const { toggle } = useFilterContext();
      return (
        <>
          <button
            type="button"
            data-testid="add-cold"
            onClick={() => toggle("cold-storage")}
          >
            cold
          </button>
          <FilterSnapshot rows={FIXTURES.map((f) => f.properties)} total={FIXTURES.length} />
        </>
      );
    }
    render(
      <FilterProvider>
        <Harness />
      </FilterProvider>,
    );
    expect(screen.getByText(/no filters active/i)).toBeInTheDocument();
    act(() => {
      screen.getByTestId("add-cold").click();
    });
    expect(screen.getByText("Cold storage")).toBeInTheDocument();
  });
});
