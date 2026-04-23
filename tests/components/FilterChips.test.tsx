import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterChips } from "@/components/map/FilterChips";
import {
  createEmptyFilterState,
  toggleFilter,
  type FilterKey,
} from "@/lib/map-filters";

describe("FilterChips", () => {
  test("renders exactly 5 toggle buttons", () => {
    render(<FilterChips state={createEmptyFilterState()} onToggle={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  test("buttons use aria-pressed (not role='switch')", () => {
    render(<FilterChips state={createEmptyFilterState()} onToggle={() => {}} />);
    expect(screen.queryByRole("switch")).toBeNull();
    for (const btn of screen.getAllByRole("button")) {
      expect(btn).toHaveAttribute("aria-pressed");
    }
  });

  test("all chips start with aria-pressed='false' when state is empty", () => {
    render(<FilterChips state={createEmptyFilterState()} onToggle={() => {}} />);
    for (const btn of screen.getAllByRole("button")) {
      expect(btn).toHaveAttribute("aria-pressed", "false");
    }
  });

  test("active chip has aria-pressed='true' and renders the close X glyph", () => {
    const active = toggleFilter(createEmptyFilterState(), "open-today");
    render(<FilterChips state={active} onToggle={() => {}} />);
    const open = screen.getByRole("button", { name: /capacity open/i });
    expect(open).toHaveAttribute("aria-pressed", "true");
    expect(open.querySelector("[data-slot=chip-close]")).not.toBeNull();
  });

  test("onToggle fires with the correct FilterKey on click", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FilterChips state={createEmptyFilterState()} onToggle={onToggle} />);
    await user.click(screen.getByRole("button", { name: /cold storage/i }));
    expect(onToggle).toHaveBeenCalledWith<[FilterKey]>("cold-storage");
  });

  test("clicking an already-active chip also fires onToggle (parent toggles semantics)", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const active = toggleFilter(createEmptyFilterState(), "overlap-flagged");
    render(<FilterChips state={active} onToggle={onToggle} />);
    await user.click(screen.getByRole("button", { name: /overlap flagged/i }));
    expect(onToggle).toHaveBeenCalledWith<[FilterKey]>("overlap-flagged");
  });

  test("renders the 'Filter' eyebrow label by default; accepts override", () => {
    const { rerender } = render(
      <FilterChips state={createEmptyFilterState()} onToggle={() => {}} />,
    );
    expect(screen.getByText("Filter")).toBeInTheDocument();
    rerender(
      <FilterChips
        state={createEmptyFilterState()}
        onToggle={() => {}}
        label="Narrow"
      />,
    );
    expect(screen.getByText("Narrow")).toBeInTheDocument();
  });
});
