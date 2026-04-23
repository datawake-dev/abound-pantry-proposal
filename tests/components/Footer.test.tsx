import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/site/Footer";

describe("Footer", () => {
  test("renders <footer>", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).not.toBeNull();
  });

  test("contains credit + disclaimer text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Built with Abound Food Care by Datawake/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/representative demo data/i),
    ).toBeInTheDocument();
  });
});
