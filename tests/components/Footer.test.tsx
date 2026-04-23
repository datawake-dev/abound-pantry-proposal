import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/site/Footer";

describe("Footer", () => {
  test("renders <footer>", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).not.toBeNull();
  });

  test("contains the disclaimer text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/representative demo data/i),
    ).toBeInTheDocument();
  });
});
