import { accounts } from "@/db/schema"
import { Account } from "../types/account"
import { db } from "@/db"
import { eq } from "drizzle-orm"

type CreateAccountInput = typeof accounts.$inferInsert

export class AccountRepository {
  static async create(data: CreateAccountInput): Promise<Account | undefined> {
    const createdAccount = await db.insert(accounts).values(data).returning()
    return createdAccount.length > 0 ? createdAccount[0] : undefined
  }

  static async findByUserId(userId: number): Promise<Account | undefined> {
    return await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    })
  }

  static async findOneById(accountId: number): Promise<Account | undefined> {
    return await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    })
  }

  static async updateBalance(id: number, newBalance: number): Promise<void> {
    await db.update(accounts).set({ balance: newBalance }).where(eq(accounts.id, id))
  }
}
