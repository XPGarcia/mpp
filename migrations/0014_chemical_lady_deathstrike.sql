ALTER TABLE "RecurrentTransaction" ADD COLUMN "next_date" timestamp NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "next_date_idx" ON "RecurrentTransaction" USING btree ("next_date");