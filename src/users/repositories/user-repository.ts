import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { User } from "../types/user"

type CreateUserInput = typeof users.$inferInsert

export class UserRepository {
  static async create(input: CreateUserInput): Promise<User> {
    const createdUser = await db.insert(users).values(input).returning()
    return createdUser[0]
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  static async findById(id: number): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }

  static async update(id: number, input: Partial<User>): Promise<User | undefined> {
    const user = await this.findById(id)
    if (!user) {
      return
    }

    const updatedUser = await db.update(users).set(input).where(eq(users.id, id)).returning()
    return updatedUser[0]
  }
}
