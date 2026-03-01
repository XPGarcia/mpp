ALTER TABLE "RecurrentTransaction" ADD COLUMN "total_occurrences" integer;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "current_occurrence" integer;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "finished_at" timestamp;