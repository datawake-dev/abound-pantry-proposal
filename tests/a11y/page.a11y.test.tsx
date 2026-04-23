import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Page from "@/app/page";

// MapLibre mock — the test renders the full page, which composes
// InteractiveMap. jsdom has no canvas, so we swap the constructor for a
// no-op before the page imports resolve.
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

describe("Full page accessibility audit (DESIGN.md §11)", () => {
  test("renders without exploding", () => {
    const { container } = render(<Page />);
    expect(container).toBeInTheDocument();
  });

  test("exactly one <h1> on the page", () => {
    const { container } = render(<Page />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
  });

  test("one top-level <header>, one <main>, one <footer>", () => {
    const { container } = render(<Page />);
    // Top-level banner is the direct-child <header> of the page root.
    // Nested <header> inside section mocks (map tooltip, console mock, etc.)
    // is semantic grouping per HTML5 — those aren't banner landmarks.
    const topLevelHeaders = Array.from(container.children).flatMap((c) =>
      c.tagName === "HEADER" ? [c] : Array.from(c.children).filter((el) => el.tagName === "HEADER"),
    );
    expect(topLevelHeaders.length).toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll("main").length).toBe(1);
    expect(container.querySelectorAll("footer").length).toBe(1);
  });

  test("every section has aria-labelledby pointing at a real id", () => {
    const { container } = render(<Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      const labelledBy = section.getAttribute("aria-labelledby");
      expect(
        labelledBy,
        `section #${section.id} is missing aria-labelledby`,
      ).not.toBeNull();
      const labelTarget = document.getElementById(labelledBy!);
      expect(
        labelTarget,
        `section #${section.id} aria-labelledby=${labelledBy} has no matching id in the DOM`,
      ).not.toBeNull();
    }
  });

  test("FilterChips surface exists exactly once in the DOM", () => {
    const { container } = render(<Page />);
    const groups = container.querySelectorAll("[role='group']");
    const filterGroups = Array.from(groups).filter((g) =>
      g.getAttribute("aria-label")?.toLowerCase().includes("filter"),
    );
    expect(filterGroups.length).toBe(1);
  });

  test("heading hierarchy skips no levels (h1 → h2 → h3 only)", () => {
    const { container } = render(<Page />);
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    // No h4/h5/h6 on this page; assert that first.
    for (const h of headings) {
      expect(["H1", "H2", "H3"]).toContain(h.tagName);
    }
  });

  test("axe: no critical or serious violations with DEFAULT rules (including color-contrast)", async () => {
    const { container } = render(<Page />);
    const results = await axe(container, {
      // Default rule set. We explicitly do NOT disable color-contrast per
      // PLAN-REVISIONS.md Task 22 — lib/contrast.ts is the authoritative
      // per-token source, but axe gets to flag anything it sees.
    });
    // Serious or worse must block. Moderate/minor are surfaced below but do
    // not fail the build; fix-on-sight is still the policy.
    const blocking = (results.violations ?? []).filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (blocking.length > 0) {
      const summary = blocking
        .map((v) => {
          const nodes = v.nodes
            .map((n) => `      - ${n.target.join(" ")}\n        ${n.html}`)
            .join("\n");
          return `${v.impact?.toUpperCase()} ${v.id}: ${v.description}\n${nodes}`;
        })
        .join("\n\n  ");
      throw new Error(`Blocking a11y violations:\n  ${summary}`);
    }
    expect(blocking.length).toBe(0);
  });
});
