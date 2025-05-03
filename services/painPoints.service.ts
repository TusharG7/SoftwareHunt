import { db } from "@/database/drizzle";
import { painPointsTable } from "@/database/schema";

export async function getPainPointsOptions() {
  const points = await db.select().from(painPointsTable);
  return points.map((p) => ({
    painPointId: p.painPointId,
    name: p.name,
    businessNeedsId: p.businessNeedsId,
  }));
}
