import { db } from "@/database/drizzle";
import { painPointsTable } from "@/database/schema";
import { desc, ilike, or, sql } from "drizzle-orm";

export async function getPainPointsOptions() {
  const points = await db.select().from(painPointsTable);
  return points.map((p) => ({
    painPointId: p.painPointId,
    name: p.name,
    businessNeedsId: p.businessNeedsId,
  }));
}

export async function searchPainPoints(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;

    // Build the search query
    const whereClause = searchTerm
      ? or(
          ilike(painPointsTable.name, `%${searchTerm}%`),
        )
      : undefined;

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(painPointsTable)
      .where(whereClause)
      .then((result) => result[0].count);

    // Get paginated results
    const painPoints = await db
      .select()
      .from(painPointsTable)
      .where(whereClause)
      .orderBy(desc(painPointsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      painPoints,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Error searching pain points:", error);
    throw error;
  }
}