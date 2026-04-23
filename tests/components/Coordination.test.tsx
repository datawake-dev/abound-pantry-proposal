import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Coordination from "@/components/site/Coordination";

describe("Coordination section", () => {
  test("renders section#coordination with h2", () => {
    render(<Coordination />);
    expect(document.getElementById("coordination")).not.toBeNull();
    expect(document.getElementById("coordination-h2")?.tagName).toBe("H2");
  });

  test("renders 4 chat bubbles with mixed system/operator", () => {
    render(<Coordination />);
    const bubbles = screen.getByTestId("chat-bubbles").querySelectorAll("li");
    expect(bubbles.length).toBe(4);
  });

  test("'representative' label present", () => {
    render(<Coordination />);
    expect(screen.getByText(/representative/i)).toBeInTheDocument();
  });

  test("Karen at St. Mark's attribution present", () => {
    render(<Coordination />);
    expect(screen.getByText(/Karen at St\. Mark's/)).toBeInTheDocument();
  });
});
