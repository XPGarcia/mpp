import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"

export const initDb = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  await client.connect()
  return drizzle(client)
}
