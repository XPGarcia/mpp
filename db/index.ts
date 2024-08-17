import * as schema from "./schema/index"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

let dbInstance: PostgresJsDatabase<typeof schema> | null = null

const createDbInstance = (): PostgresJsDatabase<typeof schema> => {
  if (!dbInstance) {
    const client = postgres(process.env.POSTGRES_URL ?? "")
    dbInstance = drizzle(client, { schema })
  }
  return dbInstance
}

export const db = createDbInstance()
