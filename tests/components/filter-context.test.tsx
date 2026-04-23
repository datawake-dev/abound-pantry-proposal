import { describe, expect, test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { FilterProvider, useFilterContext } from "@/lib/filter-context";

function Probe() {
  const { state, toggle, highlightedId, setHighlightedId } = useFilterContext();
  return (
    <div>
      <span data-testid="active-count">{state.active.size}</span>
      <span data-testid="highlighted">{highlightedId ?? "none"}</span>
      <button onClick={() => toggle("open-today")} type="button">
        toggle-open
      </button>
      <button onClick={() => toggle("cold-storage")} type="button">
        toggle-cold
      </button>
      <button onClick={() => setHighlightedId("site-1")} type="button">
        set-id
      </button>
      <button onClick={() => setHighlightedId(null)} type="button">
        clear-id
      </button>
    </div>
  );
}

describe("FilterContext", () => {
  test("throws a clear error when used outside FilterProvider", () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(() => render(<Probe />)).toThrow(/FilterProvider/);
    } finally {
      console.error = originalError;
    }
  });

  test("provides empty initial state", () => {
    render(
      <FilterProvider>
        <Probe />
      </FilterProvider>,
    );
    expect(screen.getByTestId("active-count").textContent).toBe("0");
    expect(screen.getByTestId("highlighted").textContent).toBe("none");
  });

  test("toggle adds, re-toggle removes a filter key", () => {
    render(
      <FilterProvider>
        <Probe />
      </FilterProvider>,
    );
    const btn = screen.getByRole("button", { name: "toggle-open" });
    act(() => {
      btn.click();
    });
    expect(screen.getByTestId("active-count").textContent).toBe("1");
    act(() => {
      btn.click();
    });
    expect(screen.getByTestId("active-count").textContent).toBe("0");
  });

  test("toggling two different keys both accumulate", () => {
    render(
      <FilterProvider>
        <Probe />
      </FilterProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "toggle-open" }).click();
    });
    act(() => {
      screen.getByRole("button", { name: "toggle-cold" }).click();
    });
    expect(screen.getByTestId("active-count").textContent).toBe("2");
  });

  test("setHighlightedId stores and clears the id", () => {
    render(
      <FilterProvider>
        <Probe />
      </FilterProvider>,
    );
    act(() => {
      screen.getByRole("button", { name: "set-id" }).click();
    });
    expect(screen.getByTestId("highlighted").textContent).toBe("site-1");
    act(() => {
      screen.getByRole("button", { name: "clear-id" }).click();
    });
    expect(screen.getByTestId("highlighted").textContent).toBe("none");
  });
});
