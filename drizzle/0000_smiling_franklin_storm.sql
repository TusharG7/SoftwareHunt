CREATE TABLE "admin" (
	"admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(10) DEFAULT 'ADMIN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_admin_id_unique" UNIQUE("admin_id"),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "business_needs" (
	"business_needs_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(10) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "business_needs_business_needs_id_unique" UNIQUE("business_needs_id")
);
--> statement-breakpoint
CREATE TABLE "features" (
	"feature_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_needs_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "features_feature_id_unique" UNIQUE("feature_id")
);
--> statement-breakpoint
CREATE TABLE "industries" (
	"industry_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" varchar(10) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "industries_industry_id_unique" UNIQUE("industry_id")
);
--> statement-breakpoint
CREATE TABLE "pain_points" (
	"pain_point_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_needs_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pain_points_pain_point_id_unique" UNIQUE("pain_point_id")
);
--> statement-breakpoint
CREATE TABLE "softwares" (
	"software_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"software_name" varchar(255) NOT NULL,
	"logo" text,
	"website" varchar(255),
	"description" text NOT NULL,
	"industries" jsonb,
	"business_needs" jsonb,
	"pain_points" jsonb,
	"features" jsonb,
	"is_free" boolean DEFAULT false,
	"pricing_plans" jsonb DEFAULT '[]'::jsonb,
	"testimonies" jsonb DEFAULT '[]'::jsonb,
	"snapshots" jsonb DEFAULT '{"images":[],"video":null}'::jsonb,
	"status" varchar(10) DEFAULT 'ACTIVE',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "softwares_software_id_unique" UNIQUE("software_id")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"vendor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"company_description" text NOT NULL,
	"website" varchar(255) NOT NULL,
	"founded_year" varchar(4) NOT NULL,
	"role" varchar(10) DEFAULT 'VENDOR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"status" varchar(10) DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "vendors_vendor_id_unique" UNIQUE("vendor_id"),
	CONSTRAINT "vendors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "features" ADD CONSTRAINT "features_business_needs_id_business_needs_business_needs_id_fk" FOREIGN KEY ("business_needs_id") REFERENCES "public"."business_needs"("business_needs_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pain_points" ADD CONSTRAINT "pain_points_business_needs_id_business_needs_business_needs_id_fk" FOREIGN KEY ("business_needs_id") REFERENCES "public"."business_needs"("business_needs_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "softwares" ADD CONSTRAINT "softwares_vendor_id_vendors_vendor_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("vendor_id") ON DELETE cascade ON UPDATE no action;