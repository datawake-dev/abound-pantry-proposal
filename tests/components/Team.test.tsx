import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Team from "@/components/site/Team";

describe("Team section", () => {
  test("renders section#team with h2", () => {
    render(<Team />);
    expect(document.getElementById("team")).not.toBeNull();
    expect(document.getElementById("team-h2")?.tagName).toBe("H2");
  });

  test("renders exactly 3 partner card h3s", () => {
    render(<Team />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s.length).toBe(3);
  });

  test("Datawake card body covers scope, maintenance, and open-source facts", () => {
    render(<Team />);
    const article = screen
      .getByText("Datawake", { selector: "h3" })
      .closest("article");
    expect(article).not.toBeNull();
    const text = article!.textContent!.toLowerCase();
    expect(text).toContain("software consultancy");
    expect(text).toContain("long-term maintenance");
    expect(text).toMatch(/open[-\s]source/);
    expect(text).toContain("github");
    expect(text).not.toContain("production-grade");
    expect(text).not.toContain("cutting-edge");
  });

  test("all three partners named", () => {
    render(<Team />);
    expect(screen.getByText("Abound Food Care")).toBeInTheDocument();
    expect(screen.getByText("A Million Dreams Consulting")).toBeInTheDocument();
    expect(screen.getByText("Datawake")).toBeInTheDocument();
  });
});
