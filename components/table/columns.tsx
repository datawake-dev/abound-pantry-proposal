import type { ColumnDef } from "@tanstack/react-table";
import { Snowflake, Package } from "@phosphor-icons/react/dist/ssr";
import type {
  CapacityLabel,
  DistributionFeatureProperties,
  DistributionType,
} from "@/lib/map-data";

const TYPE_LABEL: Record<DistributionType, string> = {
  pantry: "Pantry",
  frc: "FRC",
  school: "School",
  mobile: "Mobile",
  appointment: "Appt",
  supplier: "Supplier",
};

const CAPACITY_META: Record<
  CapacityLabel,
  { label: string; dot: string; fg: string; bg: string }
> = {
  open: {
    label: "Open",
    dot: "var(--status-open)",
    fg: "var(--ink)",
    bg: "rgba(16, 185, 129, 0.1)",
  },
  partial: {
    label: "Partial",
    dot: "var(--status-partial)",
    fg: "var(--brand-gold-dark)",
    bg: "var(--brand-gold-light)",
  },
  full: {
    label: "Full",
    dot: "var(--status-full)",
    fg: "var(--ink-muted)",
    bg: "var(--surface-muted)",
  },
  closed: {
    label: "Closed",
    dot: "var(--status-closed)",
    fg: "var(--ink-faint)",
    bg: "var(--surface-muted)",
  },
};

function SiteCell({ row }: { row: { original: DistributionFeatureProperties } }) {
  const { name, neighborhood } = row.original;
  return (
    <div className="flex flex-col">
      <span className="font-medium text-[var(--ink)] leading-tight">{name}</span>
      <span className="text-[11.5px] text-[var(--ink-muted)]">{neighborhood}</span>
    </div>
  );
}

function TypeBadge({ value }: { value: DistributionType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--rule-cool)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
      {TYPE_LABEL[value]}
    </span>
  );
}

function NextCell({ value }: { value: string }) {
  return <span className="tabular text-[13px] text-[var(--ink)]">{value}</span>;
}

function StorageBadges({ value }: { value: DistributionFeatureProperties["storage"] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {value.includes("cold") ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule-cool)] bg-[var(--surface-card)] px-1.5 py-0.5 text-[10.5px] text-[var(--ink)]">
          <Snowflake weight="light" className="h-2.5 w-2.5" aria-hidden />
          Cold
        </span>
      ) : null}
      {value.includes("dry") ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--rule-cool)] bg-[var(--surface-card)] px-1.5 py-0.5 text-[10.5px] text-[var(--ink)]">
          <Package weight="light" className="h-2.5 w-2.5" aria-hidden />
          Dry
        </span>
      ) : null}
    </div>
  );
}

function ModelBadge({ value }: { value: DistributionFeatureProperties["model"] }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)]">
      {value === "choice" ? "Choice" : "Box"}
    </span>
  );
}

function CapacityPill({ value }: { value: CapacityLabel }) {
  const meta = CAPACITY_META[value];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]"
      style={{ color: meta.fg, backgroundColor: meta.bg }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </span>
  );
}

function NeedsPillList({ value }: { value: string[] }) {
  const visible = value.slice(0, 2);
  const overflow = Math.max(0, value.length - 2);
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((need) => (
        <span
          key={need}
          className="inline-flex items-center rounded-full bg-[var(--brand-primary-light)] px-2 py-0.5 text-[11px] text-[var(--brand-primary-dark)]"
        >
          {need}
        </span>
      ))}
      {overflow > 0 ? (
        <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--ink-muted)]">
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

function OverlapIndicator({ value }: { value: boolean }) {
  if (!value) return <span aria-hidden className="block h-2 w-2" />;
  return (
    <span
      role="img"
      aria-label="Overlap flagged"
      className="inline-flex h-full items-center"
    >
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full bg-[var(--brand-gold)] ring-2 ring-[var(--brand-gold-light)]"
      />
    </span>
  );
}

export const columns: ColumnDef<DistributionFeatureProperties>[] = [
  {
    accessorKey: "name",
    header: "Site",
    cell: ({ row }) => <SiteCell row={row} />,
    enableSorting: true,
    size: 220,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => <TypeBadge value={getValue() as DistributionType} />,
    enableSorting: false,
    size: 120,
  },
  {
    accessorKey: "nextDistributionIso",
    header: "Next",
    cell: ({ row }) => <NextCell value={row.original.nextDistribution} />,
    enableSorting: true,
    size: 140,
  },
  {
    accessorKey: "storage",
    header: "Storage",
    cell: ({ getValue }) => (
      <StorageBadges value={getValue() as DistributionFeatureProperties["storage"]} />
    ),
    enableSorting: false,
    size: 120,
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ getValue }) => (
      <ModelBadge value={getValue() as DistributionFeatureProperties["model"]} />
    ),
    enableSorting: false,
    size: 110,
  },
  {
    accessorKey: "capacityLabel",
    header: "Capacity",
    cell: ({ getValue }) => <CapacityPill value={getValue() as CapacityLabel} />,
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "specificNeeds",
    header: "Needs",
    cell: ({ getValue }) => <NeedsPillList value={getValue() as string[]} />,
    enableSorting: false,
    size: 180,
  },
  {
    accessorKey: "isOverlap",
    header: "",
    cell: ({ getValue }) => <OverlapIndicator value={getValue() as boolean} />,
    enableSorting: true,
    size: 48,
    // Sort overlap rows first when clicked.
    sortDescFirst: true,
  },
];
