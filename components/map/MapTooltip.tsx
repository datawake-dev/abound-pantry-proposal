import { Snowflake, Package } from "@phosphor-icons/react/dist/ssr";
import type { DistributionFeature } from "@/lib/map-data";

/**
 * DESIGN.md §7.3 map tooltip.
 *
 * Pure presentation. The parent InteractiveMap renders this into a
 * MapLibre Popup via ReactDOM.createRoot on hover.
 */

const TYPE_LABEL: Record<DistributionFeature["properties"]["type"], string> = {
  pantry: "Pantry",
  frc: "Family Resource Center",
  school: "School pantry",
  mobile: "Mobile distribution",
  appointment: "Appointment-based",
};

export interface MapTooltipProps {
  feature: DistributionFeature;
}

export function MapTooltip({ feature }: MapTooltipProps) {
  const p = feature.properties;
  const visibleNeeds = p.specificNeeds.slice(0, 2);
  const overflow = Math.max(0, p.specificNeeds.length - 2);

  return (
    <div
      role="tooltip"
      className="max-w-[280px] rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-4 text-[var(--ink)] ss-float-card"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[0.95rem] leading-tight">{p.name}</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--ink-muted)]">
            {p.neighborhood}
          </p>
        </div>
        {p.isOverlap ? (
          <span
            role="img"
            aria-label="Overlap flagged"
            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-gold-light)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--brand-gold-dark)]"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]"
            />
            Overlap
          </span>
        ) : null}
      </header>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[var(--rule-cool)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {TYPE_LABEL[p.type]}
        </span>
        <span className="tabular text-[13px] text-[var(--ink)]">
          {p.nextDistribution}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.storage.includes("cold") ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule-cool)] bg-[var(--surface-card)] px-2 py-0.5 text-[11px] text-[var(--ink)]">
            <Snowflake weight="light" className="h-3 w-3" aria-hidden />
            Cold
          </span>
        ) : null}
        {p.storage.includes("dry") ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule-cool)] bg-[var(--surface-card)] px-2 py-0.5 text-[11px] text-[var(--ink)]">
            <Package weight="light" className="h-3 w-3" aria-hidden />
            Dry
          </span>
        ) : null}
      </div>

      {visibleNeeds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleNeeds.map((need) => (
            <span
              key={need}
              className="inline-flex items-center rounded-full bg-[var(--brand-primary-light)] px-2 py-0.5 text-[11px] text-[var(--brand-primary-dark)]"
            >
              {need}
            </span>
          ))}
          {overflow > 0 ? (
            <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)]">
              +{overflow} more
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
