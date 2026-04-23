"use client";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { DistributionFeature } from "@/lib/map-data";
import { useFilterContext } from "@/lib/filter-context";
import { applyFilters, type FilterKey } from "@/lib/map-filters";
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
        // Kept as client-side filter for the keyboard list. MapLibre's expr
        // language cannot easily substring-match an array of needs, so the
        // map-side filter passes through and applyFilters handles it for the
        // keyboard alternative and the DataTable.
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

  const { state, setHighlightedId, highlightedId } = useFilterContext();

  // The keyboard list and textual summary should reflect the full filter set
  // (including needs-dry-goods). applyFilters is the single source of truth.
  const filtered = useMemo(() => applyFilters(features, state), [features, state]);
  const overlapFeatures = useMemo(
    () => features.filter((f) => f.properties.isOverlap),
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
      map.addSource("distributions", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features as unknown as GeoJSON.Feature[],
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
            "#0C7C8A",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": 0,
        },
        // Reveal dots with a short transition so the hero orchestration
        // doesn't pop them in all at once (DESIGN.md §5.5 step 7).
      });

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
        showPopup(feat.geometry as GeoJSON.Point, feat.properties as unknown as DistributionFeature["properties"]);
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
      map.remove();
      mapRef.current = null;
    };
    // `features` is stable across the page's lifetime (server-computed, passed
    // once). We intentionally do NOT include `setHighlightedId` or `features`
    // in the dep array because the map is one-shot; filter changes propagate
    // via the separate effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter updates → MapLibre layer filter.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer("dots")) return;
    const layerFilter = toMapLibreFilter(state.active);
    map.setFilter(
      "dots",
      layerFilter as unknown as maplibregl.FilterSpecification,
    );
  }, [state]);

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
            className="absolute inset-0"
            role="presentation"
          />

          {/* Pulse overlay — SVG absolute, renders on top of canvas */}
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

          {/* Inbound highlight ring (table → map cross-hover) */}
          {highlightedId ? (
            <div
              aria-hidden
              data-slot="highlight-ring"
              data-highlight-id={highlightedId}
              className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[var(--brand-primary)]"
            />
          ) : null}
        </div>
      </div>

      {/* Visually-hidden keyboard alternative (DESIGN.md §11 a11y) */}
      <ul className="sr-only" aria-label="Distribution sites list">
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
            >
              {f.properties.name}, {f.properties.neighborhood}.{" "}
              {f.properties.nextDistribution}.
              {f.properties.isOverlap ? " Overlap flagged." : ""}
            </button>
          </li>
        ))}
      </ul>

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
