import type { DistributionFeature } from "@/lib/map-data";
import NotReady from "./_NotReady";

export default function Hero({ features: _features }: { features: DistributionFeature[] }) {
  return (
    <section id="hero" aria-labelledby="hero-h1">
      <h1 id="hero-h1" className="sr-only">
        Shared food-rescue data for Orange County.
      </h1>
      <NotReady name="Hero" />
    </section>
  );
}
