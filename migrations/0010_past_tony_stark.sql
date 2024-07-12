CREATE TABLE IF NOT EXISTS "AccountBalanceEntry" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"description" text NOT NULL,
	"date_from" timestamp,
	"date_to" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AccountBalanceEntry" ADD CONSTRAINT "AccountBalanceEntry_account_id_Account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "date_from_idx" ON "AccountBalanceEntry" USING btree ("date_from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "date_to_idx" ON "AccountBalanceEntry" USING btree ("date_to");