import { injectable } from "inversify"
import { CreateUserInput, User, UserRepository } from "@/modules/users/domain"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

@injectable()
export class DrizzleUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const createdUser = await db.insert(users).values(input).returning()
    return createdUser[0]
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  async findById(id: number): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }

  async update(id: number, input: Partial<User>): Promise<User | undefined> {
    const user = await this.findById(id)
    if (!user) {
      return
    }

    const updatedUser = await db.update(users).set(input).where(eq(users.id, id)).returning()
    return updatedUser[0]
  }
}
