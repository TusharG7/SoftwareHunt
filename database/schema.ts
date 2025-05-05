import { text, pgTable, varchar, uuid, timestamp, integer, jsonb, boolean, decimal } from "drizzle-orm/pg-core";

// Vendor Table
export const vendorTable = pgTable("vendors", {
  vendorId: uuid("vendor_id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  companyDescription: text("company_description").notNull(),
  website: varchar("website", { length: 255 }).notNull(),
  foundedYear: varchar("founded_year", { length: 4 }).notNull(),
  role: varchar("role", { length: 10 }).notNull().default('VENDOR'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  status: varchar("status", { length: 10 }).notNull().default('ACTIVE'),
});

// Admin Table
export const adminTable = pgTable("admin", {
  adminId: uuid("admin_id").notNull().primaryKey().defaultRandom().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).notNull().default('ADMIN'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Industry Table
export const industryTable = pgTable("industries", {
  industryId: uuid("industry_id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Business Needs Table
export const businessNeedsTable = pgTable("business_needs", {
  businessNeedsId: uuid("business_needs_id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default('ACTIVE'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Pain Points Table
export const painPointsTable = pgTable("pain_points", {
  painPointId: uuid("pain_point_id").notNull().primaryKey().defaultRandom().unique(),
  businessNeedsId: uuid("business_needs_id").notNull().references(() => businessNeedsTable.businessNeedsId, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Features Table
export const featuresTable = pgTable("features", {
  featureId: uuid("feature_id").notNull().primaryKey().defaultRandom().unique(),
  businessNeedsId: uuid("business_needs_id").notNull().references(() => businessNeedsTable.businessNeedsId, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const softwareTable = pgTable("softwares", 
  {
  softwareId: uuid("software_id").notNull().primaryKey().defaultRandom().unique(),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendorTable.vendorId, { onDelete: "cascade" }),

  softwareName: varchar("software_name", { length: 255 }).notNull(),

  logo: text("logo"),
  website: varchar("website", { length: 255 }),
  description: text("description").notNull(),
  industries: jsonb("industries").$type<string[]>(),
  businessNeeds: jsonb("business_needs").$type<string[]>(),
  painPoints: jsonb("pain_points").$type<string[]>(),
  features: jsonb("features").$type<string[]>(),
  isFree: boolean("is_free").default(false),

  snapshots: jsonb("snapshots").$type<{
    images: string[];
    video: string | null;
  }>().default({ images: [], video: null } as const),
  
  status: varchar("status", { length: 10 }).default("ACTIVE"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),

});

export const pricingTable = pgTable("pricing", {
  pricingId: uuid("pricing_id").notNull().primaryKey().defaultRandom().unique(),
  softwareId: uuid("software_id").notNull().references(() => softwareTable.softwareId, { onDelete: "cascade" }),
  tierName: varchar("tier_name", { length: 100 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  duration: varchar("duration", { length: 20 }),
  features: jsonb("features").$type<string[]>(),
  maxUsers: integer("max_users"),
});

export const testimonyTable = pgTable("testimony", {
  testimonyId: uuid("testimony_id").notNull().primaryKey().defaultRandom().unique(),
  softwareId: uuid("software_id").notNull().references(() => softwareTable.softwareId, { onDelete: "cascade" }),
  userName: varchar("user_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 255 }).notNull(),
  features: jsonb("features").$type<string[]>(),
  testimony: text("testimony").notNull(),
});

export const reviewTable = pgTable("reviews", {
  reviewId: uuid("review_id").notNull().primaryKey().defaultRandom().unique(),
  softwareId: uuid("software_id").notNull().references(() => softwareTable.softwareId, { onDelete: "cascade" }),
  pros: text("pros").notNull(),
  cons: text("cons").notNull(),
  whatWeThink: text("what_we_think").notNull(),
  // Ratings
  easeOfUse: integer("ease_of_use").notNull(),
  scalability: integer("scalability").notNull(),
  budgetFriendly: integer("budget_friendly").notNull(),
  customerSupport: integer("customer_support").notNull(),
  integrationFlexibility: integer("integration_flexibility").notNull(),
});

// Visitor Table
// export const visitorTable = pgTable("visitor", {
//   visitorId: uuid("visitor_id").notNull().primaryKey().defaultRandom().unique(),
//   ipAddress: varchar("ip_address", { length: 255 }),
//   cookieId: varchar("cookie_id", { length: 255 }),
//   created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
// });

// Lead Table
// export const leadTable = pgTable("lead", {
//   leadId: uuid("lead_id").notNull().primaryKey().defaultRandom().unique(),
//   visitorId: uuid("visitor_id").references(() => visitorTable.visitorId, { onDelete: "cascade" }),
//   firstName: varchar("first_name", { length: 255 }),
//   lastName: varchar("last_name", { length: 255 }),
//   emailAddress: varchar("email_address", { length: 255 }),
//   companyName: varchar("company_name", { length: 255 }),
//   designation: varchar("designation", { length: 255 }),
//   softwareInterestedIn: varchar("software_interested_in", { length: 255 }),
//   topFeaturesLookingFor: varchar("top_features_looking_for"),
//   numberOfPeopleUsing: integer("number_of_people_using"),
//   created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
// });

// SearchLog Table
// export const searchLogTable = pgTable("search_log", {
//   searchId: uuid("search_id").notNull().primaryKey().defaultRandom().unique(),
//   visitorId: uuid("visitor_id").references(() => visitorTable.visitorId, { onDelete: "cascade" }),
//   searchQuery: varchar("search_query", { length: 255 }),
//   searchType: varchar("search_type", { length: 255 }), // Can be ENUM if needed
//   resultsCount: integer("results_count"),
//   timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
//   created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
// });
