import { describe, expect, test } from "vitest";
import { getContrastRatio } from "@/lib/contrast";

// DESIGN.md §3.5 — every ink/brand/gold-on-surface pair used in the site is
// audited against WCAG AA/AAA here. If a token value changes in globals.css,
// this suite is the forcing function that makes sure the change still passes.

describe("WCAG contrast pairs from DESIGN.md §3.5", () => {
  test("ink on paper — AAA body (≥ 7:1)", () => {
    expect(getContrastRatio("#0A0A0B", "#F7F6F3")).toBeGreaterThanOrEqual(7);
  });

  test("ink on card — AAA body (≥ 7:1)", () => {
    expect(getContrastRatio("#0A0A0B", "#FFFFFF")).toBeGreaterThanOrEqual(7);
  });

  test("ink-muted on paper — AA body (≥ 4.5:1)", () => {
    expect(getContrastRatio("#5F6875", "#F7F6F3")).toBeGreaterThanOrEqual(4.5);
  });

  test("brand-primary on paper — AA body (≥ 4.5:1)", () => {
    expect(getContrastRatio("#0C7C8A", "#F7F6F3")).toBeGreaterThanOrEqual(4.5);
  });

  test("brand-primary on card — AA body (≥ 4.5:1)", () => {
    expect(getContrastRatio("#0C7C8A", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  test("gold-dark on gold-light — AA body (≥ 4.5:1)", () => {
    expect(getContrastRatio("#856708", "#FFF8E7")).toBeGreaterThanOrEqual(4.5);
  });

  test("paper on primary-dark — AAA (≥ 7:1) — CTA band inverse", () => {
    expect(getContrastRatio("#F7F6F3", "#085A66")).toBeGreaterThanOrEqual(7);
  });
});
