import { db } from "@/database/drizzle";
import { businessNeedsTable } from "@/database/schema";

export async function getBusinessNeedsOptions() {
  const needs = await db.select().from(businessNeedsTable);
  return needs.map((n) => ({
    businessNeedsId: n.businessNeedsId,
    name: n.name,
  }));
}