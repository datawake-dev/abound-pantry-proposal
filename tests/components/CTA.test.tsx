import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import CTA from "@/components/site/CTA";

describe("CTA band", () => {
  test("renders section#cta-band with h2", () => {
    render(<CTA />);
    expect(document.getElementById("cta-band")).not.toBeNull();
    expect(document.getElementById("cta-h2")?.tagName).toBe("H2");
  });

  test("renders 2 CTAs with correct href targets", () => {
    render(<CTA />);
    const emailCta = screen.getByRole("link", { name: /reply in the thread/i });
    expect(emailCta.getAttribute("href")).toMatch(/^mailto:/);
    const calendar = screen.getByRole("link", { name: /add to calendar/i });
    expect(calendar.getAttribute("href")).toContain("cal.com");
  });

  test("Next steps eyebrow visible", () => {
    render(<CTA />);
    expect(screen.getByText(/Next steps/i)).toBeInTheDocument();
  });
});
