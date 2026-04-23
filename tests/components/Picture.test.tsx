import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Picture from "@/components/site/Picture";

describe("Picture section", () => {
  test("renders section#picture with h2", () => {
    render(<Picture />);
    expect(document.getElementById("picture")).not.toBeNull();
    expect(document.getElementById("picture-h2")?.tagName).toBe("H2");
  });

  test("renders the density heat map with an accessible role", () => {
    render(<Picture />);
    const map = screen.getByRole("img", { name: /density heat map/i });
    expect(map).toBeInTheDocument();
  });

  test("representative-projection tag is present in body", () => {
    render(<Picture />);
    expect(screen.getByText(/representative projection/i)).toBeInTheDocument();
  });

  test("renders 3 AI nudge actions", () => {
    render(<Picture />);
    const actions = screen.getByTestId("nudge-actions").querySelectorAll("li");
    expect(actions.length).toBe(3);
  });
});
