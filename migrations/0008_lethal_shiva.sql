ALTER TABLE "Category" ADD COLUMN "spending_type_id" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Category" ADD CONSTRAINT "Category_spending_type_id_SpendingType_id_fk" FOREIGN KEY ("spending_type_id") REFERENCES "public"."SpendingType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
