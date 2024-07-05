CREATE TABLE IF NOT EXISTS "SpendingType" (
	"id" "smallserial" PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL
);
INSERT INTO "SpendingType" ("name")
VALUES 
    ('NO_APPLY'),
    ('NECESSITY'),
    ('LUXURY'),
    ('SAVINGS');