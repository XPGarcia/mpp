ALTER TABLE "RecurrentTransaction" DROP CONSTRAINT "RecurrentTransaction_transaction_id_Transaction_id_fk";
--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "type_id" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "account_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "amount" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "Transaction" ADD COLUMN "recurrent_transaction_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_type_id_TransactionType_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."TransactionType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_category_id_Category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecurrentTransaction" ADD CONSTRAINT "RecurrentTransaction_account_id_Account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."Account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurrent_transaction_id_RecurrentTransaction_id_fk" FOREIGN KEY ("recurrent_transaction_id") REFERENCES "public"."RecurrentTransaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "RecurrentTransaction" DROP COLUMN IF EXISTS "transaction_id";