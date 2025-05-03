import { db } from "@/database/drizzle";
import { softwareTable, industryTable, businessNeedsTable, painPointsTable, featuresTable, pricingTable, testimonyTable } from "@/database/schema";
import { eq, and } from "drizzle-orm";

/**
 * Checks if a software with the given name already exists.
 * @param softwareName The name of the software to check.
 * @returns Promise<boolean> - true if exists, false otherwise.
 */
export async function doesSoftwareNameExist(softwareName: string): Promise<boolean> {
  const result = await db
    .select()
    .from(softwareTable)
    .where(eq(softwareTable.softwareName, softwareName))
    .limit(1);

  return result.length > 0;
}

// Helper to get or create industry
async function getOrCreateIndustry(name: string) {
  let industry = await db.select().from(industryTable).where(eq(industryTable.name, name)).limit(1);
  if (industry.length > 0) return industry[0].industryId;
  const [created] = await db.insert(industryTable).values({ name }).returning();
  return created.industryId;
}

// Helper to get or create business need
async function getOrCreateBusinessNeed(name: string) {
  let need = await db.select().from(businessNeedsTable).where(eq(businessNeedsTable.name, name)).limit(1);
  if (need.length > 0) return need[0].businessNeedsId;
  const [created] = await db.insert(businessNeedsTable).values({ name }).returning();
  return created.businessNeedsId;
}

// Helper to get or create pain point
async function getOrCreatePainPoint(name: string, businessNeedsId: string) {
  let pain = await db.select().from(painPointsTable)
    .where(and(eq(painPointsTable.name, name), eq(painPointsTable.businessNeedsId, businessNeedsId))).limit(1);
  if (pain.length > 0) return pain[0].painPointId;
  const [created] = await db.insert(painPointsTable).values({ name, businessNeedsId }).returning();
  return created.painPointId;
}

// Helper to get or create feature
async function getOrCreateFeature(name: string, businessNeedsId: string) {
  let feat = await db.select().from(featuresTable)
    .where(and(eq(featuresTable.name, name), eq(featuresTable.businessNeedsId, businessNeedsId))).limit(1);
  if (feat.length > 0) return feat[0].featureId;
  const [created] = await db.insert(featuresTable).values({ name, businessNeedsId }).returning();
  return created.featureId;
}

export async function addSoftware(formData: any) {
  // 1. Industries: get or create, collect IDs
  const industryIds: string[] = [];
  for (const name of formData.industries) {
    const id = await getOrCreateIndustry(name);
    industryIds.push(id);
  }

  // 2. Business Needs: get or create, collect IDs
  const businessNeedsIds: string[] = [];
  for (const need of formData.business_needs) {
    // Handle both database IDs and newly added items
    const needName = typeof need === 'string' ? need : need.name;
    const id = await getOrCreateBusinessNeed(needName);
    businessNeedsIds.push(id);
  }

  // 3. Pain Points: get or create, collect IDs
  const painPointIds: string[] = [];
  for (const pain of formData.pain_points) {
    for (const bnId of pain.associations) {
      // If it's a new business need, we need to get its actual ID
      const businessNeedName = bnId.startsWith('new_') ? 
        formData.business_needs.find((bn: any) => bn.name === bnId.replace('new_', ''))?.name :
        bnId;
      
      if (businessNeedName) {
        const id = await getOrCreatePainPoint(pain.name, businessNeedName);
        painPointIds.push(id);
      }
    }
  }

  // 4. Features: get or create, collect IDs
  const featureIds: string[] = [];
  for (const feat of formData.key_features) {
    for (const bnId of feat.associations) {
      // If it's a new business need, we need to get its actual ID
      const businessNeedName = bnId.startsWith('new_') ? 
        formData.business_needs.find((bn: any) => bn.name === bnId.replace('new_', ''))?.name :
        bnId;
      
      if (businessNeedName) {
        const id = await getOrCreateFeature(feat.name, businessNeedName);
        featureIds.push(id);
      }
    }
  }

  // 5. Create Software
  const [software] = await db.insert(softwareTable).values({
    vendorId: formData.vendor_id,
    softwareName: formData.software_name,
    logo: formData.logo,
    website: formData.website || null,
    description: formData.description,
    industries: industryIds,
    businessNeeds: businessNeedsIds,
    painPoints: painPointIds,
    features: featureIds,
    isFree: formData.is_free || false,
    snapshots: {
      images: formData.snapshots?.images || [],
      video: formData.snapshots?.video || null,
    },
    // status, createdAt, updatedAt handled by defaults
  }).returning();

  return software;
}
