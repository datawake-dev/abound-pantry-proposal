import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import LiveState from "@/components/site/LiveState";

describe("LiveState section", () => {
  test("renders section#live-state with h2", () => {
    render(<LiveState />);
    expect(document.getElementById("live-state")).not.toBeNull();
    expect(document.getElementById("live-state-h2")?.tagName).toBe("H2");
  });

  test("renders 3 console columns", () => {
    render(<LiveState />);
    const cols = screen.getByTestId("console-columns").children;
    expect(cols.length).toBe(3);
  });

  test("Representative caption present", () => {
    render(<LiveState />);
    expect(screen.getByText(/Representative layout/i)).toBeInTheDocument();
  });
});
