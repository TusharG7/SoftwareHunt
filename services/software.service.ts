import { db } from "@/database/drizzle";
import { softwareTable, industryTable, businessNeedsTable, painPointsTable, featuresTable, pricingTable, testimonyTable, reviewTable } from "@/database/schema";
import { eq, and, count, asc, desc } from "drizzle-orm";

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
  try {
    console.log('Processing formData:', JSON.stringify(formData, null, 2));
    
    // 1. Industries: get or create, collect IDs
    const industryIds: string[] = [];
    for (const name of formData.industries) {
      const id = await getOrCreateIndustry(name);
      industryIds.push(id);
    }

    // 2. Business Needs: get or create, collect IDs
    const businessNeedsMap = new Map<string, string>();
    for (const need of formData.business_needs) {
      const needName = typeof need === 'string' ? need : need.name;
      const id = await getOrCreateBusinessNeed(needName);
      businessNeedsMap.set(needName, id);
      
      if (need.businessNeedsId && need.businessNeedsId.startsWith('new_')) {
        businessNeedsMap.set(need.businessNeedsId, id);
      } else if (need.businessNeedsId) {
        businessNeedsMap.set(need.businessNeedsId, need.businessNeedsId);
      }
    }

    // 3. Pain Points: get or create, collect IDs
    const painPointIds: string[] = [];
    const painPointMap = new Map<string, string>();

    for (const pain of formData.pain_points) {
      let painPointId = pain.painPointId;
      let businessNeedId = pain.businessNeedsId;
      
      // Check if this is an existing pain point first (no new_ prefix)
      if (painPointId && !painPointId.startsWith('new_')) {
        painPointIds.push(painPointId);
        continue;
      }
      
      // If businessNeedId is empty, try to find the pain point by name in the database
      if (!businessNeedId || businessNeedId === '') {
        // Look up pain point by name
        const existingPains = await db
          .select()
          .from(painPointsTable)
          .where(eq(painPointsTable.name, pain.name));
        
        if (existingPains.length > 0) {
          // If found, add the ID and continue
          painPointIds.push(existingPains[0].painPointId);
          // Map the temp ID to the actual ID
          if (pain.painPointId) {
            painPointMap.set(pain.painPointId, existingPains[0].painPointId);
          }
          console.log(`Found existing pain point "${pain.name}" with ID ${existingPains[0].painPointId}`);
          continue;
        } else if (pain.associations && pain.associations.length > 0) {
          // If has associations but no business need ID, use the first association
          businessNeedId = pain.associations[0];
        } else {
          console.log(`Skipping pain point "${pain.name}" - no business need associated`);
          continue;
        }
      }

      // Get the actual business need ID
      let actualBusinessNeedId = businessNeedId;
      if (businessNeedId && businessNeedId.startsWith('new_')) {
        actualBusinessNeedId = businessNeedsMap.get(businessNeedId) || businessNeedsMap.get(businessNeedId.replace('new_', ''));
      } else if (businessNeedId) {
        actualBusinessNeedId = businessNeedsMap.get(businessNeedId) || businessNeedId;
      }

      if (actualBusinessNeedId) {
        const id = await getOrCreatePainPoint(pain.name, actualBusinessNeedId);
        painPointIds.push(id);
        
        if (pain.painPointId) {
          painPointMap.set(pain.painPointId, id);
        }
      } else {
        console.log(`Could not find actual business need ID for pain point "${pain.name}"`);
      }
    }

    // 4. Features: get or create, collect IDs
    const featureIds: string[] = [];
    const featureMap = new Map<string, string>();

    for (const feat of formData.key_features) {
      const featureId = feat.featureId;
      let businessNeedId = feat.businessNeedsId;
      
      // Check if this is an existing feature first (no new_ prefix)
      if (featureId && !featureId.startsWith('new_')) {
        featureIds.push(featureId);
        featureMap.set(featureId, featureId);
        continue;
      }
      
      // If businessNeedId is empty, try to find the feature by name in the database
      if (!businessNeedId || businessNeedId === '') {
        // Look up feature by name
        const existingFeatures = await db
          .select()
          .from(featuresTable)
          .where(eq(featuresTable.name, feat.name));
        
        if (existingFeatures.length > 0) {
          // If found, add the ID and continue
          featureIds.push(existingFeatures[0].featureId);
          // Map the temp ID to the actual ID
          if (feat.featureId) {
            featureMap.set(feat.featureId, existingFeatures[0].featureId);
          }
          console.log(`Found existing feature "${feat.name}" with ID ${existingFeatures[0].featureId}`);
          continue;
        } else if (feat.associations && feat.associations.length > 0) {
          // If has associations but no business need ID, use the first association
          businessNeedId = feat.associations[0];
        } else {
          console.log(`Skipping feature "${feat.name}" - no business need associated and not found in database`);
          continue;
        }
      }

      // Get the actual business need ID
      let actualBusinessNeedId = businessNeedId;
      if (businessNeedId && businessNeedId.startsWith('new_')) {
        actualBusinessNeedId = businessNeedsMap.get(businessNeedId) || businessNeedsMap.get(businessNeedId.replace('new_', ''));
      } else if (businessNeedId) {
        actualBusinessNeedId = businessNeedsMap.get(businessNeedId) || businessNeedId;
      }

      if (actualBusinessNeedId) {
        const id = await getOrCreateFeature(feat.name, actualBusinessNeedId);
        featureIds.push(id);
        
        if (feat.featureId) {
          featureMap.set(feat.featureId, id);
        }
      } else {
        console.log(`Could not find actual business need ID for feature "${feat.name}"`);
      }
    }

    console.log('FeatureMap:', Object.fromEntries(featureMap.entries()));
    console.log('Features in software:', featureIds);

    // 5. Create Software
    const [software] = await db.insert(softwareTable).values({
      vendorId: formData.vendor_id,
      softwareName: formData.software_name,
      logo: formData.logo,
      website: formData.website || null,
      description: formData.description,
      industries: industryIds,
      businessNeeds: Array.from(new Set(businessNeedsMap.values())),
      painPoints: painPointIds,
      features: featureIds,
      isFree: formData.is_free || false,
      snapshots: {
        images: formData.snapshots?.images || [],
        video: formData.snapshots?.video || null,
      },
    }).returning();

    // 6. Add Pricing Plans if software is not free
    if (!formData.is_free && formData.pricing_tiers?.length > 0) {
      await Promise.all(
        formData.pricing_tiers.map(async (tier: any) => {
          // Convert temporary feature IDs to actual feature IDs
          const actualFeatureIds = await Promise.all(
            tier.features.map(async (tempId: string) => {
              // If it's an existing feature (not prefixed with new_)
              if (!tempId.startsWith('new_')) {
                // Verify it exists in the database
                const [feature] = await db
                  .select()
                  .from(featuresTable)
                  .where(eq(featuresTable.featureId, tempId))
                  .limit(1);
                
                return feature ? tempId : null;
              }
              
              // Otherwise look it up in our map
              const actualId = featureMap.get(tempId);
              if (!actualId) {
                console.log(`Could not find actual ID for feature with temp ID: ${tempId}`);
                return null;
              }
              return actualId;
            })
          );

          // Filter out any null values
          const validFeatureIds = actualFeatureIds.filter(Boolean);

          console.log(`For pricing tier "${tier.tierName}":`, {
            originalFeatures: tier.features,
            mappedFeatures: validFeatureIds
          });

          return db.insert(pricingTable).values({
            softwareId: software.softwareId,
            tierName: tier.tierName,
            price: tier.price,
            duration: tier.duration,
            features: validFeatureIds,
            maxUsers: tier.maxUsers,
          });
        })
      );
    }

    // 7. Add Testimonies if any
    if (formData.testimonies?.length > 0) {
      await Promise.all(
        formData.testimonies.map(async (testimony: any) => {
          // Convert temporary feature IDs to actual feature IDs
          const actualFeatureIds = await Promise.all(
            testimony.featuresBenefitted.map(async (tempId: string) => {
              // If it's an existing feature (not prefixed with new_)
              if (!tempId.startsWith('new_')) {
                // Verify it exists in the database
                const [feature] = await db
                  .select()
                  .from(featuresTable)
                  .where(eq(featuresTable.featureId, tempId))
                  .limit(1);
                
                return feature ? tempId : null;
              }
              
              // Otherwise look it up in our map
              const actualId = featureMap.get(tempId);
              if (!actualId) {
                console.log(`Could not find actual ID for feature with temp ID: ${tempId}`);
                return null;
              }
              return actualId;
            })
          );

          // Filter out any null values
          const validFeatureIds = actualFeatureIds.filter(Boolean);

          console.log(`For testimony by "${testimony.userName}":`, {
            originalFeatures: testimony.featuresBenefitted,
            mappedFeatures: validFeatureIds
          });

          return db.insert(testimonyTable).values({
            softwareId: software.softwareId,
            userName: testimony.userName,
            industry: testimony.industry || '',
            features: validFeatureIds,
            testimony: testimony.text,
          });
        })
      );
    }

    // 8. Add Review
    if (formData.softwareHuntReview) {
      await db.insert(reviewTable).values({
        softwareId: software.softwareId,
        pros: formData.softwareHuntReview.pros,
        cons: formData.softwareHuntReview.cons,
        whatWeThink: formData.softwareHuntReview.what_we_think,
        easeOfUse: formData.softwareHuntReview.ratings.ease_of_use,
        scalability: formData.softwareHuntReview.ratings.scalability,
        budgetFriendly: formData.softwareHuntReview.ratings.budget_friendly,
        customerSupport: formData.softwareHuntReview.ratings.customer_support,
        integrationFlexibility: formData.softwareHuntReview.ratings.integration_flexibility,
      });
    }

    return software;
  } catch (error) {
    console.error("Error adding software:", error);
    throw new Error("Failed to add software: " + (error as Error).message);
  }
}

export async function getAllSoftware({
  page = 1,
  itemsPerPage = 10,
  sortBy = 'updatedAt',
  sortOrder = 'desc'
}: {
  page?: number;
  itemsPerPage?: number;
  sortBy?: 'softwareName' | 'status' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}): Promise<{
  softwares: {
    softwareId: string;
    softwareName: string;
    logo: string | null;
    website: string | null;
    description: string | null;
    status: string | null;
    isFree: boolean | null;
    industries: { id: string; name: string; }[] | null;
    businessNeeds: { id: string; name: string; }[] | null;
    updatedAt: Date | null;
  }[];
  totalCount: number;
  page: number;
}> {
  try {
    const offset = (page - 1) * itemsPerPage;

    const softwareQuery = db
      .select({
        softwareId: softwareTable.softwareId,
        softwareName: softwareTable.softwareName,
        logo: softwareTable.logo,
        website: softwareTable.website,
        description: softwareTable.description,
        status: softwareTable.status,
        isFree: softwareTable.isFree,
        industries: softwareTable.industries,
        businessNeeds: softwareTable.businessNeeds,
        updatedAt: softwareTable.updatedAt,
      })
      .from(softwareTable)
      .limit(itemsPerPage)
      .offset(offset)
      .orderBy(sortOrder === 'asc' ? asc(softwareTable[sortBy]) : desc(softwareTable[sortBy]));
      const countQuery = db
      .select({ count: count() })
      .from(softwareTable);
    
    const [softwares, countResult] = await Promise.all([softwareQuery, countQuery]);
    const totalCount = countResult[0]?.count || 0;

    // Fetch industry names for each software
    const softwaresWithDetailedInfo = await Promise.all(
      softwares.map(async (software: any) => {
        // Process industries
        const industryNames = software.industries ? await Promise.all(
          software.industries.map(async (industryId: any) => {
            const [industry] = await db
              .select({ id: industryTable.industryId, name: industryTable.name })
              .from(industryTable)
              .where(eq(industryTable.industryId, industryId))
              .limit(1);
            return industry;
          })
        ) : null;

        // Process business needs
        const businessNeedsNames = software.businessNeeds ? await Promise.all(
          software.businessNeeds.map(async (businessNeedId: any) => {
            const [businessNeed] = await db
              .select({ id: businessNeedsTable.businessNeedsId, name: businessNeedsTable.name })
              .from(businessNeedsTable)
              .where(eq(businessNeedsTable.businessNeedsId, businessNeedId))
              .limit(1);
            return businessNeed;
          })
        ) : null;

        return {
          ...software,
          industries: industryNames,
          businessNeeds: businessNeedsNames,
        };
      })
    );

    return {
      softwares: softwaresWithDetailedInfo,
      totalCount,
      page,
    };
  } catch (error) {
    console.error("Error fetching software:", error);
    throw new Error("Failed to fetch software.");
  }
}