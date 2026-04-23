import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Scope from "@/components/site/Scope";

describe("Scope section", () => {
  test("renders section#scope with h2", () => {
    render(<Scope />);
    expect(document.getElementById("scope")).not.toBeNull();
    expect(document.getElementById("scope-h2")?.tagName).toBe("H2");
  });

  test("renders 8 scope bullets", () => {
    render(<Scope />);
    const bullets = screen.getByTestId("scope-bullets").querySelectorAll("li");
    expect(bullets.length).toBe(8);
  });

  test("renders 4 timeline dt/dd rows", () => {
    render(<Scope />);
    const dl = screen.getByTestId("scope-timeline");
    const dts = dl.querySelectorAll("dt");
    const dds = dl.querySelectorAll("dd");
    expect(dts.length).toBe(4);
    expect(dds.length).toBe(4);
  });

  test("budget numbers render in font-sans (Geist) not body", () => {
    render(<Scope />);
    const build = screen.getByTestId("budget-build");
    expect(build.textContent).toContain("$100");
    expect(build.getAttribute("style")).toContain("--font-sans");
  });
});
