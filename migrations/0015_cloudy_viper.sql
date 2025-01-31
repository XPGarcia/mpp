CREATE TABLE IF NOT EXISTS "OTPCode" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" varchar(6) NOT NULL,
	"expired_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OTPCode" ADD CONSTRAINT "OTPCode_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
