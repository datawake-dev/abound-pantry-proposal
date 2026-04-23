import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/site/Header";

describe("Header (Floating Fluid Island)", () => {
  test("renders <header> + <nav aria-label='Primary'>", () => {
    const { container } = render(<Header />);
    expect(container.querySelector("header")).not.toBeNull();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });

  test("renders 3 anchor links to #picture, #coordination, #scope", () => {
    render(<Header />);
    const links = screen.getByTestId("nav-links").querySelectorAll("a");
    expect(links.length).toBe(3);
    const hrefs = Array.from(links).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["#picture", "#coordination", "#scope"]);
  });

  test("Contact CTA points to #cta-band", () => {
    render(<Header />);
    expect(screen.getByTestId("nav-cta").getAttribute("href")).toBe("#cta-band");
  });

  test("PROPOSAL tag present in wordmark region", () => {
    render(<Header />);
    expect(screen.getByText(/Proposal/)).toBeInTheDocument();
  });
});
