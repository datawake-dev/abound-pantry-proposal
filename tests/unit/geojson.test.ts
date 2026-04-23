import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DistributionFeatureCollection } from "@/lib/map-data";

const fc = JSON.parse(
  readFileSync(join(process.cwd(), "public/data/anaheim-distributions.geojson"), "utf-8"),
) as DistributionFeatureCollection;

describe("Anaheim GeoJSON", () => {
  test("FeatureCollection of Points with 50–120 features", () => {
    expect(fc.type).toBe("FeatureCollection");
    expect(fc.features.length).toBeGreaterThanOrEqual(50);
    expect(fc.features.length).toBeLessThanOrEqual(120);
    for (const f of fc.features) expect(f.geometry.type).toBe("Point");
  });

  test("every feature has required properties with correct types", () => {
    for (const f of fc.features) {
      const p = f.properties;
      expect(p.id).toMatch(/^[\w-]+$/);
      expect(p.name.length).toBeGreaterThan(3);
      expect([
        "pantry",
        "frc",
        "school",
        "mobile",
        "appointment",
        "supplier",
      ]).toContain(p.type);
      expect(["open", "partial", "full", "closed"]).toContain(p.capacityLabel);
      expect(["box", "choice"]).toContain(p.model);
      expect(Array.isArray(p.storage)).toBe(true);
      for (const s of p.storage) expect(["dry", "cold"]).toContain(s);
      expect(typeof p.isOverlap).toBe("boolean");
      expect(typeof p.nextDistribution).toBe("string");
      expect(typeof p.nextDistributionIso).toBe("string");
      expect(new Date(p.nextDistributionIso).toString()).not.toBe("Invalid Date");
    }
  });

  test("exactly 3 overlap-flagged sites clustered on Lincoln Ave", () => {
    const overlaps = fc.features.filter((f) => f.properties.isOverlap);
    expect(overlaps.length).toBe(3);
    const [lng0, lat0] = overlaps[0].geometry.coordinates;
    for (const o of overlaps) {
      const [lng, lat] = o.geometry.coordinates;
      expect(Math.abs(lng - lng0)).toBeLessThan(0.005);
      expect(Math.abs(lat - lat0)).toBeLessThan(0.005);
    }
  });

  test("every feature within Anaheim bounds", () => {
    for (const f of fc.features) {
      const [lng, lat] = f.geometry.coordinates;
      expect(lng).toBeGreaterThanOrEqual(-118.05);
      expect(lng).toBeLessThanOrEqual(-117.70);
      expect(lat).toBeGreaterThanOrEqual(33.79);
      expect(lat).toBeLessThanOrEqual(33.89);
    }
  });

  test("ids are unique", () => {
    const ids = fc.features.map((f) => f.properties.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
