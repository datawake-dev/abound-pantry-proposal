import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapTooltip } from "@/components/map/MapTooltip";
import type { DistributionFeature } from "@/lib/map-data";

function feature(overrides: Partial<DistributionFeature["properties"]> = {}): DistributionFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [-117.88, 33.855] },
    properties: {
      id: "first-baptist-lincoln",
      name: "First Baptist Lincoln",
      neighborhood: "East Anaheim",
      type: "pantry",
      nextDistribution: "Sat 9–11 am",
      nextDistributionIso: "2026-04-25T09:00:00-07:00",
      storage: ["dry", "cold"],
      model: "box",
      capacityLabel: "partial",
      specificNeeds: ["protein", "weekend slot", "spanish-speaking volunteer"],
      isOverlap: true,
      ...overrides,
    },
  };
}

describe("MapTooltip", () => {
  test("renders site name, neighborhood, type label, and distribution time", () => {
    render(<MapTooltip feature={feature()} />);
    expect(screen.getByText("First Baptist Lincoln")).toBeInTheDocument();
    expect(screen.getByText("East Anaheim")).toBeInTheDocument();
    expect(screen.getByText("Pantry")).toBeInTheDocument();
    expect(screen.getByText("Sat 9–11 am")).toBeInTheDocument();
  });

  test("renders Cold + Dry storage badges when both present", () => {
    render(<MapTooltip feature={feature({ storage: ["dry", "cold"] })} />);
    expect(screen.getByText("Cold")).toBeInTheDocument();
    expect(screen.getByText("Dry")).toBeInTheDocument();
  });

  test("renders only Dry when storage is dry-only", () => {
    render(<MapTooltip feature={feature({ storage: ["dry"] })} />);
    expect(screen.getByText("Dry")).toBeInTheDocument();
    expect(screen.queryByText("Cold")).not.toBeInTheDocument();
  });

  test("shows overlap flag when isOverlap=true", () => {
    render(<MapTooltip feature={feature({ isOverlap: true })} />);
    expect(screen.getByLabelText("Overlap flagged")).toBeInTheDocument();
    expect(screen.getByText("Overlap")).toBeInTheDocument();
  });

  test("omits overlap flag when isOverlap=false", () => {
    render(<MapTooltip feature={feature({ isOverlap: false })} />);
    expect(screen.queryByLabelText("Overlap flagged")).not.toBeInTheDocument();
  });

  test("shows first 2 specific needs + overflow counter", () => {
    render(
      <MapTooltip
        feature={feature({
          specificNeeds: ["protein", "weekend slot", "spanish-speaking volunteer"],
        })}
      />,
    );
    expect(screen.getByText("protein")).toBeInTheDocument();
    expect(screen.getByText("weekend slot")).toBeInTheDocument();
    expect(screen.queryByText("spanish-speaking volunteer")).not.toBeInTheDocument();
    expect(screen.getByText("+1 more")).toBeInTheDocument();
  });

  test("renders no needs section when specificNeeds is empty", () => {
    const { container } = render(
      <MapTooltip feature={feature({ specificNeeds: [] })} />,
    );
    expect(container.querySelector("[data-slot=needs]")).toBeNull();
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });
});
