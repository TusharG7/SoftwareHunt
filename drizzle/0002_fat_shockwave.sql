ALTER TABLE "pricing" ALTER COLUMN "duration" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "pricing" ADD COLUMN "features" jsonb;--> statement-breakpoint
ALTER TABLE "testimony" ADD COLUMN "features" jsonb;