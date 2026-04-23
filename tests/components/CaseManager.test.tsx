import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseManager from "@/components/site/CaseManager";

describe("CaseManager section", () => {
  test("renders section#case-manager with h2", () => {
    render(<CaseManager />);
    expect(document.getElementById("case-manager")).not.toBeNull();
    expect(document.getElementById("case-manager-h2")?.tagName).toBe("H2");
  });

  test("cmdk input is pre-populated with the representative query", () => {
    render(<CaseManager />);
    const input = screen.getByLabelText(/Pantry search query/i) as HTMLInputElement;
    expect(input.value).toContain("walkable 92804");
    expect(input.value).toContain("spanish-speaking");
  });

  test("renders 3 default result items", () => {
    render(<CaseManager />);
    expect(screen.getByTestId("result-0")).toBeInTheDocument();
    expect(screen.getByTestId("result-1")).toBeInTheDocument();
    expect(screen.getByTestId("result-2")).toBeInTheDocument();
  });

  test("aria-live region for result count is present", () => {
    render(<CaseManager />);
    expect(screen.getByTestId("cmdk-live").getAttribute("aria-live")).toBe("polite");
  });

  test("selecting a result opens the inline detail panel and moves focus to its heading", async () => {
    const user = userEvent.setup();
    render(<CaseManager />);
    await user.click(screen.getByTestId("result-0"));
    const panel = screen.getByRole("region", { name: /result detail/i });
    expect(panel).toBeInTheDocument();
    const heading = panel.querySelector("h3");
    expect(heading).not.toBeNull();
    expect(document.activeElement).toBe(heading);
  });
});
