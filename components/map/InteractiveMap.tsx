"use client";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { DistributionFeature } from "@/lib/map-data";
import { useFilterContext } from "@/lib/filter-context";
import {
  applyFilters,
  computeNeedsDryGoods,
  type FilterKey,
} from "@/lib/map-filters";
import { MapTooltip } from "./MapTooltip";

/**
 * Hero map — Anaheim distribution sites.
 *
 * Contracts:
 * - DESIGN.md §7.3: OpenFreeMap positron style, bounds Anaheim envelope,
 *   dots teal default + gold when isOverlap, hover popup, keyboard alternative.
 * - PLAN-REVISIONS Task 9: Server Component passes GeoJSON via prop (no
 *   client-side fetch); popup on hover (not click); visually-hidden <ul> for
 *   keyboard users; textual summary.
 * - DESIGN.md §5.6: CSS pulse rings at the overlap cluster center (3 cycles
 *   then stop).
 * - DESIGN.md §10.3 CLS guard: the outer container reserves aspect-ratio
 *   before MapLibre mounts.
 *
 * Filter state + highlightedId flow through FilterContext. Map and
 * DataTable both read/write the same context; row hover cross-highlights a
 * dot, dot hover cross-highlights a row.
 */

const ANAHEIM_BOUNDS: [[number, number], [number, number]] = [
  [-118.05, 33.79],
  [-117.7, 33.89],
];

const POSITRON_STYLE = "https://tiles.openfreemap.org/styles/positron";

export interface InteractiveMapProps {
  features: DistributionFeature[];
}

// MapLibre's FilterSpecification type is a deep union that TS narrows poorly
// when concatenating dynamic filter expressions. The runtime accepts the
// shapes we emit below; we use `unknown[]` plus a cast at the boundary rather
// than a large forest of explicit tuples here.
function toMapLibreFilter(activeFilters: Set<FilterKey>): unknown[] | null {
  if (activeFilters.size === 0) return null;
  const all: unknown[][] = [];
  for (const key of activeFilters) {
    switch (key) {
      case "open-today":
        all.push(["==", ["get", "capacityLabel"], "open"]);
        break;
      case "cold-storage":
        all.push(["in", "cold", ["get", "storage"]]);
        break;
      case "choice-market":
        all.push(["==", ["get", "model"], "choice"]);
        break;
      case "overlap-flagged":
        all.push(["==", ["get", "isOverlap"], true]);
        break;
      case "needs-dry-goods":
        // A boolean property precomputed at source-add-time (see enriched
        // below). Keeps the map + table + keyboard list in perfect sync.
        all.push(["==", ["get", "needsDryGoods"], true]);
        break;
    }
  }
  return all.length ? ["all", ...all] : null;
}

export function InteractiveMap({ features }: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const popupRootRef = useRef<Root | null>(null);
  const popupNodeRef = useRef<HTMLDivElement | null>(null);
  const styleLoadedRef = useRef(false);
  // Cache the latest active filter set so the map's "load" callback can read
  // the up-to-date value at the moment the style finishes loading, even if
  // filters were toggled before that happened.
  const activeFiltersRef = useRef<Set<FilterKey>>(new Set());

  const { state, setHighlightedId, highlightedId } = useFilterContext();

  // Keep a ref to the latest filter set so the map's one-shot "load" callback
  // can apply the correct filter even if state changed before load completed.
  useEffect(() => {
    activeFiltersRef.current = state.active;
  }, [state]);

  // The keyboard list and textual summary should reflect the full filter set.
  // applyFilters is the single source of truth.
  const filtered = useMemo(() => applyFilters(features, state), [features, state]);
  const overlapFeatures = useMemo(
    () => features.filter((f) => f.properties.isOverlap),
    [features],
  );

  // Enrich features with the derived `needsDryGoods` boolean so the MapLibre
  // filter expression stays a simple `["==", ["get", "needsDryGoods"], true]`.
  // Calculated once per render at a cost of O(N) string compares per feature.
  const enrichedFeatures = useMemo(
    () =>
      features.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          needsDryGoods: computeNeedsDryGoods(f.properties.specificNeeds),
        },
      })),
    [features],
  );

  // Overlap cluster centroid — anchor the pulse rings.
  const overlapCenter = useMemo(() => {
    if (overlapFeatures.length === 0) return null;
    let sumLng = 0;
    let sumLat = 0;
    for (const f of overlapFeatures) {
      const [lng, lat] = f.geometry.coordinates;
      sumLng += lng;
      sumLat += lat;
    }
    return {
      lng: sumLng / overlapFeatures.length,
      lat: sumLat / overlapFeatures.length,
    };
  }, [overlapFeatures]);

  // Map init + feature layer setup. Runs once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: POSITRON_STYLE,
      bounds: ANAHEIM_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      maxZoom: 15,
      attributionControl: { compact: true },
    });

    mapRef.current = map;

    map.on("load", () => {
      styleLoadedRef.current = true;

      map.addSource("distributions", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: enrichedFeatures as unknown as GeoJSON.Feature[],
        },
      });

      // Heat layer — renders coverage density across the Anaheim bounds so a
      // viewer reads "hot spots + cool spots" at a glance before drilling
      // into individual dots. Cool (transparent teal) at low density, warm
      // (gold) at high density. Sits beneath the dots layer so specific
      // sites remain visible.
      map.addLayer({
        id: "heat",
        type: "heatmap",
        source: "distributions",
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "case",
            ["==", ["get", "isOverlap"], true],
            1.4,
            ["==", ["get", "type"], "supplier"],
            0.6,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            1,
            15,
            2.2,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(12, 124, 138, 0)",
            0.15,
            "rgba(12, 124, 138, 0.22)",
            0.35,
            "rgba(12, 124, 138, 0.42)",
            0.55,
            "rgba(90, 146, 138, 0.58)",
            0.75,
            "rgba(212, 168, 67, 0.68)",
            1,
            "rgba(212, 168, 67, 0.82)",
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            28,
            12,
            44,
            15,
            70,
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.8,
            14,
            0.7,
            15,
            0.5,
          ],
        },
      });

      map.addLayer({
        id: "dots",
        type: "circle",
        source: "distributions",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 4, 15, 8],
          "circle-color": [
            "case",
            ["==", ["get", "isOverlap"], true],
            "#D4A843",
            ["==", ["get", "type"], "supplier"],
            "#3A4758",
            "#0C7C8A",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": 0,
        },
      });

      // Highlight layer — renders a teal ring around the currently
      // highlighted feature (driven by FilterContext: row hover, keyboard
      // focus on a list button, or dot mouseenter). MapLibre auto-reprojects
      // on pan/zoom so the ring stays glued to the dot.
      map.addLayer({
        id: "dots-highlight",
        type: "circle",
        source: "distributions",
        filter: ["==", ["get", "id"], "__none__"],
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 9, 15, 14],
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-color": "#0C7C8A",
          "circle-stroke-width": 2.5,
          "circle-stroke-opacity": 0.9,
        },
      });

      // Apply any filter toggled before style load finished. Both the dots
      // and the heat layer read the same filter expression so the heatmap
      // narrows to match whatever the chips select.
      const initial = toMapLibreFilter(activeFiltersRef.current);
      map.setFilter(
        "dots",
        initial as unknown as maplibregl.FilterSpecification,
      );
      map.setFilter(
        "heat",
        initial as unknown as maplibregl.FilterSpecification,
      );

      // Stagger in the dots.
      requestAnimationFrame(() => {
        map.setPaintProperty("dots", "circle-opacity", 1);
      });

      map.on("mouseenter", "dots", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feat = e.features?.[0];
        if (!feat) return;
        const id = feat.properties?.id as string | undefined;
        if (id) setHighlightedId(id);
        showPopup(
          feat.geometry as GeoJSON.Point,
          feat.properties as unknown as DistributionFeature["properties"],
        );
      });

      map.on("mouseleave", "dots", () => {
        map.getCanvas().style.cursor = "";
        setHighlightedId(null);
        closePopup();
      });
    });

    function showPopup(
      geom: GeoJSON.Point,
      props: DistributionFeature["properties"],
    ) {
      if (!mapRef.current) return;
      if (!popupNodeRef.current) {
        popupNodeRef.current = document.createElement("div");
        popupRootRef.current = createRoot(popupNodeRef.current);
      }
      popupRootRef.current?.render(
        <MapTooltip
          feature={{ type: "Feature", geometry: geom, properties: props }}
        />,
      );
      if (!popupRef.current) {
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 14,
          className: "oc-pantry-popup",
        });
      }
      popupRef.current
        .setLngLat([geom.coordinates[0], geom.coordinates[1]])
        .setDOMContent(popupNodeRef.current)
        .addTo(mapRef.current);
    }

    function closePopup() {
      popupRef.current?.remove();
    }

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      popupRootRef.current?.unmount();
      popupRootRef.current = null;
      popupNodeRef.current = null;
      styleLoadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // `enrichedFeatures` is derived from `features` which is stable across the
    // page's lifetime (server-computed, passed once). The map is one-shot;
    // filter and highlight changes propagate via the separate effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter updates → MapLibre layer filter. Both the dots and the heat
  // layer track the same filter expression so the heatmap reflects the
  // currently selected chips.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current || !map.getLayer("dots")) return;
    const layerFilter = toMapLibreFilter(state.active);
    map.setFilter(
      "dots",
      layerFilter as unknown as maplibregl.FilterSpecification,
    );
    if (map.getLayer("heat")) {
      map.setFilter(
        "heat",
        layerFilter as unknown as maplibregl.FilterSpecification,
      );
    }
  }, [state]);

  // Highlight updates → MapLibre highlight layer filter. Using a MapLibre
  // layer (rather than an HTML overlay) lets pan/zoom keep the ring glued to
  // the dot without extra projection bookkeeping.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current || !map.getLayer("dots-highlight"))
      return;
    const next = highlightedId ?? "__none__";
    map.setFilter(
      "dots-highlight",
      ["==", ["get", "id"], next] as unknown as maplibregl.FilterSpecification,
    );
  }, [highlightedId]);

  const overlapCount = overlapFeatures.length;

  return (
    <figure className="relative">
      {/* Double-Bezel outer shell (DESIGN.md §6.1) */}
      <div className="p-1.5 rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] ring-1 ring-[rgba(10,10,11,0.06)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(10,10,11,0.03)]">
        {/* Double-Bezel inner core + CLS-safe aspect-ratio container */}
        <div
          className="relative rounded-[calc(1.75rem-0.375rem)] bg-white overflow-hidden ss-float-card"
          style={{ aspectRatio: "16 / 9", minHeight: "360px" }}
        >
          <div
            ref={containerRef}
            data-testid="map-canvas"
            className="h-full w-full"
            role="presentation"
          />

          {/* Pulse overlay — SVG absolute, renders on top of canvas.
              Anchored to 50/50 of the map box; the overlap cluster sits near
              the visual center of the Anaheim bounds so this is good enough
              without per-tick map.project() calls. Refine only if/when the
              bounds shift. */}
          {overlapCount > 0 && overlapCenter ? (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              data-slot="pulse-overlay"
            >
              <circle
                cx="50"
                cy="50"
                r="2"
                fill="none"
                stroke="#D4A843"
                strokeWidth="0.5"
                className="ss-pulse-1"
              />
              <circle
                cx="50"
                cy="50"
                r="2"
                fill="none"
                stroke="#D4A843"
                strokeWidth="0.3"
                className="ss-pulse-2"
              />
            </svg>
          ) : null}

          {/* Highlight ring marker — kept as a data-* stub so tests can assert
              cross-highlight wiring without coupling to MapLibre internals.
              The visible ring itself is rendered by the dots-highlight
              MapLibre layer (see useEffect above). */}
          {highlightedId ? (
            <span
              aria-hidden
              data-slot="highlight-ring"
              data-highlight-id={highlightedId}
              className="sr-only"
            />
          ) : null}
        </div>
      </div>

      {/* Keyboard alternative (DESIGN.md §11 a11y).
          Visually hidden by default so the hero map owns the space, but the
          wrapping region opts in to `focus-within` — once a keyboard user
          tabs in, the list reveals in place so they're not tabbing through
          invisible controls. Screen-reader users always get the list via the
          sr-only semantics. */}
      <div
        className="focus-within:not-sr-only focus-within:block sr-only mt-4 rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-4 ring-1 ring-[var(--rule-cool)]"
        data-slot="keyboard-list-region"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Map locations, keyboard-accessible
        </p>
        <ul className="mt-3 space-y-2" aria-label="Distribution sites list">
          {filtered.map((f) => (
            <li key={f.properties.id}>
              <button
                type="button"
                data-feature-id={f.properties.id}
                onFocus={() => setHighlightedId(f.properties.id)}
                onBlur={() => setHighlightedId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHighlightedId(f.properties.id);
                  }
                }}
                className="block w-full rounded-md border border-[var(--rule-cool)] bg-[var(--surface-card)] px-3 py-2 text-left text-[13px] text-[var(--ink)] transition-colors hover:border-[var(--brand-primary)] focus-visible:border-[var(--brand-primary)]"
              >
                <span className="font-medium">{f.properties.name}</span>
                <span className="text-[var(--ink-muted)]">
                  {" "}· {f.properties.neighborhood} · {f.properties.nextDistribution}
                  {f.properties.storage.length > 0
                    ? ` · ${f.properties.storage.join(" + ")} storage`
                    : ""}
                  {f.properties.isOverlap ? " · Overlap flagged" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Textual summary (DESIGN.md §11 map alternate) */}
      <figcaption
        className="mt-4 max-w-[58ch] text-sm text-[var(--ink-muted)]"
        data-slot="map-summary"
      >
        <p>
          Representative distribution sites in Anaheim.{" "}
          {overlapCount === 3 ? (
            <>
              Three sites flagged as overlapping on Saturday 9 am in central
              Anaheim.
            </>
          ) : overlapCount > 0 ? (
            <>
              {overlapCount} site{overlapCount === 1 ? " is" : "s are"} flagged
              as overlapping.
            </>
          ) : null}{" "}
          Filter by capability below.
        </p>
      </figcaption>

      <p
        className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-faint)]"
        data-slot="map-disclaimer"
      >
        Representative demo data. Live coordination layer in development.
      </p>
    </figure>
  );
}
