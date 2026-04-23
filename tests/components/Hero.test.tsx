import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/site/Hero";
import { FilterProvider } from "@/lib/filter-context";
import type { DistributionFeature } from "@/lib/map-data";

// Reuse the MapLibre stub from InteractiveMap tests.
vi.mock("maplibre-gl", () => {
  function MapStub() {
    return {
      on: vi.fn(),
      off: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      setFilter: vi.fn(),
      setPaintProperty: vi.fn(),
      getLayer: vi.fn().mockReturnValue(undefined),
      isStyleLoaded: vi.fn().mockReturnValue(false),
      getCanvas: vi.fn().mockReturnValue({ style: {} }),
      remove: vi.fn(),
    };
  }
  function PopupStub() {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      setDOMContent: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    };
  }
  return { default: { Map: MapStub, Popup: PopupStub } };
});
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}));

function feature(id: string, isOverlap = false): DistributionFeature {
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
      isOverlap,
    },
  };
}

const FIXTURES: DistributionFeature[] = [
  feature("a", true),
  feature("b", true),
  feature("c", true),
  feature("d"),
];

function renderHero() {
  return render(
    <FilterProvider>
      <Hero features={FIXTURES} />
    </FilterProvider>,
  );
}

describe("Hero section", () => {
  test("renders <section id='hero'> with exactly one <h1>", () => {
    renderHero();
    const section = document.getElementById("hero");
    expect(section).not.toBeNull();
    const h1s = section!.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
  });

  test("H1 text includes 'Orange County' with teal accent span", () => {
    renderHero();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Orange County");
    // The accent span should exist with the teal class
    const accentSpan = Array.from(h1.querySelectorAll("span")).find((s) =>
      s.textContent?.includes("Orange County"),
    );
    expect(accentSpan).toBeDefined();
    expect(accentSpan!.className).toContain("text-[var(--brand-primary)]");
  });

  test("Primary + Secondary CTAs render with correct hrefs", () => {
    renderHero();
    const primary = screen.getByRole("link", { name: /Read the proposal/i });
    expect(primary.getAttribute("href")).toBe("#shared-database");
    const secondary = screen.getByRole("link", { name: /How it works/i });
    expect(secondary.getAttribute("href")).toBe("#coordination");
  });

  test("Hero does NOT render FilterChips — chips belong in SharedDatabase", () => {
    renderHero();
    // The FilterChips component sets role="group" with name /filter/i. If present
    // in Hero, that would violate DESIGN.md §8.4 (single chip surface site-wide).
    const groups = screen.queryAllByRole("group", { name: /filter/i });
    expect(groups).toHaveLength(0);
  });

  test("renders the gold overlap caption with default (no filter) copy", () => {
    renderHero();
    const caption = screen.getByRole("note", { name: /overlap caption/i });
    expect(caption).toBeInTheDocument();
    expect(caption.textContent).toContain("Sat 9:00am");
    // The caption was reworded away from "The system cannot see this" to a
    // descriptive sentence about the overlap.
    expect(caption.textContent).not.toContain("system cannot see this");
    expect(caption.textContent).toContain("Three pantries");
    expect(caption.textContent).toContain("300m");
  });

  test("renders hero eyebrow", () => {
    renderHero();
    expect(screen.getByText(/Proposal for Abound Food Care/i)).toBeInTheDocument();
  });

  test("lazy-loaded InteractiveMap placeholder renders inside an aspect-ratio container", () => {
    renderHero();
    // Since Task 27b — InteractiveMap is lazy-loaded to keep MapLibre out of
    // the initial bundle. The Hero renders a CLS-safe placeholder; the map
    // hydrates past LCP. The textual summary is covered by the a11y test
    // where the full page renders (map included).
    const placeholder = document.querySelector('[style*="aspect-ratio: 16 / 9"]');
    expect(placeholder).not.toBeNull();
  });
});
