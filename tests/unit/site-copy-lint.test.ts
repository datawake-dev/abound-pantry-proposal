import { describe, expect, test } from "vitest";
import { SITE } from "@/lib/site-data";
import { lintSlop, type SlopFinding } from "@/lib/slop-lint";

// Walk every string reachable from SITE, returning the JSON path and value.
function walkStrings(
  obj: unknown,
  path: string[] = [],
): Array<{ path: string; value: string }> {
  if (typeof obj === "string") {
    return [{ path: path.join(".") || "<root>", value: obj }];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => walkStrings(v, [...path, String(i)]));
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      walkStrings(v, [...path, k]),
    );
  }
  return [];
}

const stringsUnderSite = walkStrings(SITE);

// Strings we intentionally exclude from slop-lint:
// - href values containing mailto:/https: (URLs are not prose).
// - the CTA band email is URL-encoded; slop rules don't apply to URL params.
// The filter is path-based so it stays transparent in failure output.
const HREF_PATHS = new Set(
  stringsUnderSite
    .filter(({ path }) => path.endsWith(".href"))
    .map(({ path }) => path),
);
// Code-block content (API request/response) is not prose; exempt from em-dash
// clause rule but still must not contain banned SaaS vocabulary.
const CODE_PATHS = new Set<string>([
  "publicInfrastructure.apiRequest",
  "publicInfrastructure.apiResponse",
]);

const lintable = stringsUnderSite.filter(({ path }) => !HREF_PATHS.has(path));

describe("SITE copy passes slop-lint", () => {
  test.each(lintable)("$path is slop-free", ({ path, value }) => {
    const findings: SlopFinding[] = lintSlop(value);
    // Allow em-dash-clause in code paths; never allow it elsewhere.
    const disallowed = CODE_PATHS.has(path)
      ? findings.filter((f) => f.rule !== "em-dash-clause")
      : findings;
    if (disallowed.length > 0) {
      throw new Error(
        `${path}: ${disallowed.map((f) => f.rule).join(", ")}\n` +
          `  "${value}"`,
      );
    }
    expect(disallowed).toHaveLength(0);
  });
});

describe("SITE copy honors the scrub table from PLAN-REVISIONS.md", () => {
  test("Problem body does not contain 'tens of millions of pounds'", () => {
    expect(SITE.problem.body.toLowerCase()).not.toContain(
      "tens of millions of pounds",
    );
  });

  test("Picture body tags its 32 percent claim as representative projection", () => {
    const body = SITE.picture.body;
    if (body.includes("32 percent") || body.includes("32%")) {
      expect(body).toContain("(representative projection)");
    }
  });

  test("Coordination body drops the '300-plus' count", () => {
    expect(SITE.coordination.body).not.toMatch(/300[-\s]?plus/i);
  });

  test("CaseManager body avoids unsourced precise walking distance", () => {
    expect(SITE.caseManager.body).not.toMatch(/0\.6[- ]mile/i);
  });

  test("Datawake team card uses flattened three-sentence copy", () => {
    const datawake = SITE.team.partners.find((p) => p.name === "Datawake");
    expect(datawake).toBeDefined();
    expect(datawake!.body).toContain(
      "Software consultancy building the system.",
    );
    expect(datawake!.body).toContain("Long-term maintenance included.");
    expect(datawake!.body).toContain(
      "Open-source codebase on GitHub.",
    );
    expect(datawake!.body.toLowerCase()).not.toContain("production-grade");
    expect(datawake!.body.toLowerCase()).not.toContain("cutting-edge");
  });
});
