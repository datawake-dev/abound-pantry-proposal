import type { DistributionFeature } from "@/lib/map-data";
import NotReady from "./_NotReady";

export default function SharedDatabase({ features: _features }: { features: DistributionFeature[] }) {
  return (
    <section id="shared-database" aria-labelledby="shared-database-h2">
      <h2 id="shared-database-h2" className="sr-only">
        Every distribution, every week. One source of truth.
      </h2>
      <NotReady name="SharedDatabase" />
    </section>
  );
}
