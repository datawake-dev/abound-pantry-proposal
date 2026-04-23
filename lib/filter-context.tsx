"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createEmptyFilterState,
  toggleFilter,
  type FilterKey,
  type FilterState,
} from "@/lib/map-filters";

/**
 * FilterContext — shared filter + cross-hover highlight state between the
 * hero InteractiveMap (Task 14) and the SharedDatabase DataTable (Task 12).
 *
 * DESIGN.md §8.4: one FilterProvider mounted at the root of the page. Both
 * map dots and table rows read from and write to this context so the filter
 * chips (rendered once in SharedDatabase) control both surfaces, and hover on
 * a row puts a ring around the matching dot (and vice versa).
 */

export interface FilterContextValue {
  state: FilterState;
  toggle: (key: FilterKey) => void;
  highlightedId: string | null;
  setHighlightedId: (id: string | null) => void;
}

const FilterCtx = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FilterState>(createEmptyFilterState);
  const [highlightedId, setHighlightedIdState] = useState<string | null>(null);

  const toggle = useCallback((key: FilterKey) => {
    setState((prev) => toggleFilter(prev, key));
  }, []);

  const setHighlightedId = useCallback((id: string | null) => {
    setHighlightedIdState(id);
  }, []);

  const value = useMemo<FilterContextValue>(
    () => ({ state, toggle, highlightedId, setHighlightedId }),
    [state, toggle, highlightedId, setHighlightedId],
  );

  return <FilterCtx.Provider value={value}>{children}</FilterCtx.Provider>;
}

export function useFilterContext(): FilterContextValue {
  const value = useContext(FilterCtx);
  if (!value) {
    throw new Error(
      "useFilterContext must be used inside <FilterProvider>. " +
        "Wrap the tree in app/page.tsx or a parent client boundary.",
    );
  }
  return value;
}
