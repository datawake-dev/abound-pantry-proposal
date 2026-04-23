import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { DistributionFeature, DistributionFeatureCollection } from "@/lib/map-data";
import { FilterProvider, useFilterContext } from "@/lib/filter-context";
import { InteractiveMap } from "@/components/map/InteractiveMap";

// MapLibre has to be mocked before importing InteractiveMap — jsdom has no
// canvas support, and we're testing the DOM/a11y layer, not the map tiles.
vi.mock("maplibre-gl", () => {
  function MapStub(this: unknown) {
    return {
      on: vi.fn(),
      off: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      removeSource: vi.fn(),
      setFilter: vi.fn(),
      setPaintProperty: vi.fn(),
      getLayer: vi.fn().mockReturnValue(undefined),
      isStyleLoaded: vi.fn().mockReturnValue(false),
      getCanvas: vi.fn().mockReturnValue({ style: {} }),
      remove: vi.fn(),
      fitBounds: vi.fn(),
    };
  }
  function PopupStub(this: unknown) {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      setDOMContent: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    };
  }
  return {
    default: {
      Map: MapStub,
      Popup: PopupStub,
    },
  };
});

// Silence the MapLibre CSS import in jsdom.
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}));

function feature(
  id: string,
  overrides: Partial<DistributionFeature["properties"]> & {
    coordinates?: [number, number];
  } = {},
): DistributionFeature {
  const { coordinates = [-117.9, 33.85], ...props } = overrides;
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates },
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

const FIXTURES: DistributionFeatureCollection = {
  type: "FeatureCollection",
  features: [
    feature("a", { isOverlap: true, coordinates: [-117.88, 33.855] }),
    feature("b", { isOverlap: true, coordinates: [-117.881, 33.854] }),
    feature("c", { isOverlap: true, coordinates: [-117.879, 33.856] }),
    feature("d"),
    feature("e"),
  ],
};

function renderMap(features = FIXTURES.features) {
  return render(
    <FilterProvider>
      <InteractiveMap features={features} />
    </FilterProvider>,
  );
}

describe("InteractiveMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders textual summary (map-alternate, DESIGN.md §11)", () => {
    renderMap();
    const summary = document.querySelector("[data-slot=map-summary]");
    expect(summary).not.toBeNull();
    expect(summary!.textContent).toContain("Representative distribution sites");
    expect(summary!.textContent).toContain("Anaheim");
  });

  test("renders representative disclaimer", () => {
    renderMap();
    expect(
      screen.getByText(/Representative demo data\. Live coordination layer/i),
    ).toBeInTheDocument();
  });

  test("renders visually-hidden keyboard list with one item per filtered feature", () => {
    renderMap();
    const listbox = screen.getByRole("list", { name: /Distribution sites list/i });
    const items = listbox.querySelectorAll("button[data-feature-id]");
    expect(items.length).toBe(FIXTURES.features.length);
  });

  test("keyboard Enter on a list item fires setHighlightedId via context", async () => {
    const user = userEvent.setup();

    function Observer() {
      const { highlightedId } = useFilterContext();
      return <span data-testid="highlighted">{highlightedId ?? "none"}</span>;
    }

    render(
      <FilterProvider>
        <InteractiveMap features={FIXTURES.features} />
        <Observer />
      </FilterProvider>,
    );

    const btn = screen.getByRole("button", { name: /Site a/ });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("highlighted").textContent).toBe("a");
  });

  test("inbound highlightedId ring renders with data-highlight-id attr", () => {
    function Driver() {
      const { setHighlightedId } = useFilterContext();
      return (
        <button
          onClick={() => setHighlightedId("d")}
          type="button"
          data-testid="set-d"
        >
          set-d
        </button>
      );
    }

    render(
      <FilterProvider>
        <InteractiveMap features={FIXTURES.features} />
        <Driver />
      </FilterProvider>,
    );

    expect(document.querySelector("[data-slot=highlight-ring]")).toBeNull();

    act(() => {
      screen.getByTestId("set-d").click();
    });

    const ring = document.querySelector("[data-slot=highlight-ring]");
    expect(ring).not.toBeNull();
    expect(ring!.getAttribute("data-highlight-id")).toBe("d");
  });

  test("renders the pulse overlay when overlap features exist", () => {
    renderMap();
    expect(document.querySelector("[data-slot=pulse-overlay]")).not.toBeNull();
  });

  test("skips the pulse overlay when no overlap features present", () => {
    renderMap([feature("solo", { isOverlap: false })]);
    expect(document.querySelector("[data-slot=pulse-overlay]")).toBeNull();
  });

  test("filters applied via FilterContext narrow the keyboard list", () => {
    function Driver() {
      const { toggle } = useFilterContext();
      return (
        <button
          onClick={() => toggle("overlap-flagged")}
          type="button"
          data-testid="filter-overlap"
        >
          overlap
        </button>
      );
    }
    render(
      <FilterProvider>
        <InteractiveMap features={FIXTURES.features} />
        <Driver />
      </FilterProvider>,
    );
    // Initial: 5 items.
    expect(
      document.querySelectorAll("[data-feature-id]").length,
    ).toBe(5);
    act(() => {
      screen.getByTestId("filter-overlap").click();
    });
    // Only 3 overlap-flagged features pass.
    expect(
      document.querySelectorAll("[data-feature-id]").length,
    ).toBe(3);
  });
});
