import { describe, expect, test } from "vitest";
import { lintSlop } from "@/lib/slop-lint";

describe("lintSlop — clean copy", () => {
  test("plain nonprofit sentence passes", () => {
    expect(lintSlop("Shared food-rescue data for Orange County.")).toEqual([]);
  });

  test("en dash in numeric range is allowed (e.g. 9–11 am)", () => {
    expect(lintSlop("Saturday, 9–11 am, 80 bags.")).toEqual([]);
  });

  test("hyphen in compound modifier is allowed (e.g. food-rescue)", () => {
    expect(lintSlop("open-source, food-rescue, case-manager flow")).toEqual([]);
  });

  test("colon-separated clauses OK", () => {
    expect(lintSlop("Three partners: Abound, AMDC, Datawake.")).toEqual([]);
  });
});

describe("lintSlop — banned vocabulary", () => {
  const cases: Array<[string, string]> = [
    ["empower", "This will empower operators."],
    ["leverage-verb", "We leverage data to route supply."],
    ["unlock", "Unlock coordination across the county."],
    ["transform-your", "Transform your food-rescue operation."],
    ["seamless", "A seamless handoff between teams."],
    ["game-changer", "This is a game-changer."],
    ["move-the-needle", "We move the needle on hunger."],
    ["unleash", "Unleash the power of shared data."],
    ["fast-paced-world", "In today's fast-paced world, coordination is hard."],
    ["synergy", "We need real synergy across partners."],
    ["revolutioniz", "Revolutionize how food moves."],
    ["revolutionary", "A revolutionary approach."],
    ["best-in-class", "Best-in-class AI stack."],
    ["cutting-edge", "Our cutting-edge platform."],
    ["world-class", "A world-class team."],
    ["next-level", "Take it to the next level."],
    ["production-grade", "Production-grade infrastructure."],
    ["next-gen", "Our next-generation system."],
  ];
  test.each(cases)("flags %s", (expected, text) => {
    const f = lintSlop(text);
    expect(f.length).toBeGreaterThan(0);
    expect(f.some((x) => x.rule === expected)).toBe(true);
  });
});

describe("lintSlop — em dash rule", () => {
  test("em dash as clause separator flagged (whitespace on both sides)", () => {
    const f = lintSlop("This works — but we should test it.");
    expect(f.some((x) => x.rule === "em-dash-clause")).toBe(true);
  });

  test("em dash in a quoted title is flagged the same way", () => {
    const f = lintSlop("OC Pantry Coordination — Proposal");
    expect(f.some((x) => x.rule === "em-dash-clause")).toBe(true);
  });

  test("en dash between numbers is NOT flagged", () => {
    expect(lintSlop("$100–200K build").some((x) => x.rule === "em-dash-clause")).toBe(false);
  });

  test("hyphen is NOT flagged", () => {
    expect(lintSlop("food-rescue coordination").some((x) => x.rule === "em-dash-clause")).toBe(false);
  });
});
