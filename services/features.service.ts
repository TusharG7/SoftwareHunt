import { db } from "@/database/drizzle";
import { featuresTable } from "@/database/schema";

export async function getFeaturesOptions() {
  const features = await db.select().from(featuresTable);
  return features.map((f) => ({
    featureId: f.featureId,
    name: f.name,
    businessNeedsId: f.businessNeedsId,
  }));
}