import type { Config } from "drizzle-kit"

export default {
  schema: "./db/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL ?? "",
  },
} satisfies Config
