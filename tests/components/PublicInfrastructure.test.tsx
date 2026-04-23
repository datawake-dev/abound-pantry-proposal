import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import PublicInfrastructure from "@/components/site/PublicInfrastructure";

describe("PublicInfrastructure section", () => {
  test("renders section#public-infrastructure with h2", () => {
    render(<PublicInfrastructure />);
    expect(document.getElementById("public-infrastructure")).not.toBeNull();
    expect(document.getElementById("public-infrastructure-h2")?.tagName).toBe(
      "H2",
    );
  });

  test("renders 4 badge pills", () => {
    render(<PublicInfrastructure />);
    const badges = screen.getByTestId("infra-badges").querySelectorAll("li");
    expect(badges.length).toBe(4);
  });

  test("syntax-highlighted code block renders a <pre> with the token spans", () => {
    render(<PublicInfrastructure />);
    const block = screen.getByTestId("code-block");
    expect(block.tagName).toBe("PRE");
    // Spans for tokens (keys, strings, etc.) render inside the code block.
    expect(block.querySelectorAll("span").length).toBeGreaterThan(10);
  });

  test("Copy button has accessible label", () => {
    render(<PublicInfrastructure />);
    expect(screen.getByLabelText(/Copy API sample to clipboard/i)).toBeInTheDocument();
  });
});
