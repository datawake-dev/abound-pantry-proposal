import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Picture from "@/components/site/Picture";

describe("Picture section", () => {
  test("renders section#picture with h2", () => {
    render(<Picture />);
    expect(document.getElementById("picture")).not.toBeNull();
    expect(document.getElementById("picture-h2")?.tagName).toBe("H2");
  });

  test("scenario tool renders 3 pantry checkboxes", () => {
    render(<Picture />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(3);
  });

  test("representative-projection tag is present in body", () => {
    render(<Picture />);
    expect(screen.getByText(/representative projection/i)).toBeInTheDocument();
  });

  test("renders scenario metrics with 3 entries tagged representative", () => {
    render(<Picture />);
    const metrics = screen.getByTestId("scenario-metrics").querySelectorAll("li");
    expect(metrics.length).toBe(3);
  });
});
