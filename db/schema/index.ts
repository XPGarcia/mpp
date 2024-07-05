import {
  pgTable,
  serial,
  smallserial,
  pgEnum,
  text,
  timestamp,
  varchar,
  integer,
  smallint,
  doublePrecision,
} from "drizzle-orm/pg-core"

export const users = pgTable("User", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  verifiedAt: timestamp("verified_at"),
  onboardedAt: timestamp("onboarded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const transactionTypes = pgTable("TransactionType", {
  id: smallserial("id").primaryKey(),
  name: varchar("name", { length: 10 }).notNull(),
})

export const spendingTypes = pgEnum("SpendingType", ["NECESSITY", "LUXURY", "SAVINGS"])

export const categories = pgTable("Category", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  transactionTypeId: smallint("transaction_type_id")
    .references(() => transactionTypes.id)
    .notNull(),
  spendingType: spendingTypes("SpendingType").default("NECESSITY"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const transactions = pgTable("Transaction", {
  id: serial("id").primaryKey(),
  typeId: smallint("type_id")
    .references(() => transactionTypes.id)
    .notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const feedbacks = pgTable("Feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const accounts = pgTable("Account", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name").notNull(),
  balance: doublePrecision("balance").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const budgets = pgTable("Budget", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name").notNull(),
  living: smallint("living").notNull(),
  savings: smallint("savings").notNull(),
  entertainment: smallint("entertainment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
