import * as schema from "./schema/index"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.POSTGRES_URL ?? "")
export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema })
