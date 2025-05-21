import { db } from "@/database/drizzle";
import { featuresTable } from "@/database/schema";
import { desc, ilike, or, sql } from "drizzle-orm";

export async function getFeaturesOptions() {
  const features = await db.select().from(featuresTable);
  return features.map((f) => ({
    featureId: f.featureId,
    name: f.name,
    businessNeedsId: f.businessNeedsId,
  }));
}

export async function searchFeatures(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;

    // Build the search query
    const whereClause = searchTerm
      ? or(
          ilike(featuresTable.name, `%${searchTerm}%`),
        )
      : undefined;

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(featuresTable)
      .where(whereClause)
      .then((result) => result[0].count);

    // Get paginated results
    const features = await db
      .select()
      .from(featuresTable)
      .where(whereClause)
      .orderBy(desc(featuresTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      features,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Error searching features:", error);
    throw error;
  }
}