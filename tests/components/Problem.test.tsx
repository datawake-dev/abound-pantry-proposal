import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Problem from "@/components/site/Problem";

describe("Problem section", () => {
  test("renders section#problem with h2", () => {
    render(<Problem />);
    const section = document.getElementById("problem");
    expect(section).not.toBeNull();
    const h2 = document.getElementById("problem-h2");
    expect(h2?.tagName).toBe("H2");
  });

  test("renders the Lincoln Ave cutout SVG with role=img and accessible name", () => {
    render(<Problem />);
    const img = screen.getByRole("img", { name: /Lincoln Ave overlap cluster/i });
    expect(img).toBeInTheDocument();
  });

  test("heading hierarchy: no h1, has h2", () => {
    render(<Problem />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
