import { db } from "@/database/drizzle";
import { industryTable } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getIndustryOptions() {
  const industries = await db.select().from(industryTable).where(eq(industryTable.status, "ACTIVE"));
  // Return as array of { industryId, name }
  return industries.map((ind) => ({
    industryId: ind.industryId,
    name: ind.name,
  }));
}
