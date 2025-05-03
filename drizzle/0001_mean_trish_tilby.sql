CREATE TABLE "pricing" (
	"pricing_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"software_id" uuid NOT NULL,
	"tier_name" varchar(100) NOT NULL,
	"price" numeric(10, 2),
	"duration" varchar(50),
	"max_users" integer,
	CONSTRAINT "pricing_pricing_id_unique" UNIQUE("pricing_id")
);
--> statement-breakpoint
CREATE TABLE "testimony" (
	"testimony_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"software_id" uuid NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"industry" varchar(255) NOT NULL,
	"testimony" text NOT NULL,
	CONSTRAINT "testimony_testimony_id_unique" UNIQUE("testimony_id")
);
--> statement-breakpoint
ALTER TABLE "pricing" ADD CONSTRAINT "pricing_software_id_softwares_software_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."softwares"("software_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimony" ADD CONSTRAINT "testimony_software_id_softwares_software_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."softwares"("software_id") ON DELETE cascade ON UPDATE no action;