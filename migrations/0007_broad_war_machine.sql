DO $$ BEGIN
 CREATE TYPE "public"."SpendingType" AS ENUM('NECESSITY', 'LUXURY', 'SAVINGS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Category" ADD COLUMN "SpendingType" "SpendingType" DEFAULT 'NECESSITY';