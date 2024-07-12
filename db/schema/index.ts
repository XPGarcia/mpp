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
  index,
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

export const spendingTypes = pgTable("SpendingType", {
  id: smallserial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
})

export const categories = pgTable("Category", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  transactionTypeId: smallint("transaction_type_id")
    .references(() => transactionTypes.id)
    .notNull(),
  spendingTypeId: smallint("spending_type_id")
    .references(() => spendingTypes.id)
    .notNull(),
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
  accountId: integer("account_id")
    .references(() => accounts.id)
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

export const accountBalanceEntries = pgTable(
  "AccountBalanceEntry",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id")
      .notNull()
      .references(() => accounts.id),
    amount: doublePrecision("amount").notNull(),
    description: text("description").notNull(),
    dateFrom: timestamp("date_from"),
    dateTo: timestamp("date_to"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      dateFromIdx: index("date_from_idx").on(table.dateFrom),
      dateToIdx: index("date_to_idx").on(table.dateTo),
    }
  }
)
