import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("User", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
