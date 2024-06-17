CREATE TABLE IF NOT EXISTS "Category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"user_id" integer,
	"transaction_type_id" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TransactionType" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"name" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"type_id" smallint NOT NULL,
	"category_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"amount" double precision NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Category" ADD CONSTRAINT "Category_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Category" ADD CONSTRAINT "Category_transaction_type_id_TransactionType_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."TransactionType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_type_id_TransactionType_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."TransactionType"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_category_id_Category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
