CREATE TABLE IF NOT EXISTS "RecurrentTransaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer NOT NULL,
	"frequency_id" smallint NOT NULL,
	"start_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionFrequency" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL
);
INSERT INTO "TransactionFrequency" ("name")
VALUES 
    ('DAILY'),
    ('WEEKLY'),
    ('MONTHLY'),
    ('YEARLY');
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_transaction_id_Transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_frequency_id_TransactionFrequency_id_fk" FOREIGN KEY ("frequency_id") REFERENCES "public"."TransactionFrequency"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
