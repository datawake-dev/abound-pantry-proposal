import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DistributionFeatureCollection } from "@/lib/map-data";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import SharedDatabase from "@/components/site/SharedDatabase";
import Problem from "@/components/site/Problem";
import Picture from "@/components/site/Picture";
import Coordination from "@/components/site/Coordination";
import LiveState from "@/components/site/LiveState";
import CaseManager from "@/components/site/CaseManager";
import PublicInfrastructure from "@/components/site/PublicInfrastructure";
import Team from "@/components/site/Team";
import Scope from "@/components/site/Scope";
import CTA from "@/components/site/CTA";

// Server Component: GeoJSON read once at render, passed to client components
// via typed prop. No client-side fetch (PLAN-REVISIONS Task 9 invert-data-flow).
const distributions = JSON.parse(
  readFileSync(
    join(process.cwd(), "public/data/anaheim-distributions.geojson"),
    "utf-8",
  ),
) as DistributionFeatureCollection;

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero features={distributions.features} />
        <SharedDatabase features={distributions.features} />
        <Problem />
        <Picture />
        <Coordination />
        <LiveState />
        <CaseManager />
        <PublicInfrastructure />
        <Team />
        <Scope />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
