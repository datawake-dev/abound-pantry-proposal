export type DistributionType = "pantry" | "frc" | "school" | "mobile" | "appointment";
export type CapacityLabel = "open" | "partial" | "full" | "closed";
export type DistributionModel = "box" | "choice";
export type StorageCapability = "dry" | "cold";

export interface DistributionFeatureProperties {
  id: string;
  name: string;
  neighborhood: string;
  type: DistributionType;
  nextDistribution: string; // human-readable e.g. "Sat 9–11 am"
  nextDistributionIso: string; // ISO-8601 with tz for sorting
  storage: StorageCapability[];
  model: DistributionModel;
  capacityLabel: CapacityLabel;
  specificNeeds: string[];
  isOverlap: boolean;
}

export type DistributionFeature = GeoJSON.Feature<GeoJSON.Point, DistributionFeatureProperties>;
export type DistributionFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  DistributionFeatureProperties
>;
