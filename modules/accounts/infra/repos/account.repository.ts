import { injectable } from "inversify"

import { Account, AccountRepository, CreateAccountInput } from "@/modules/accounts/domain"
import { db } from "@/db"
import { accounts } from "@/db/schema"
import { eq } from "drizzle-orm"

@injectable()
export class DrizzleAccountRepository implements AccountRepository {
  async create(data: CreateAccountInput): Promise<Account | undefined> {
    const createdAccount = await db.insert(accounts).values(data).returning()
    return createdAccount.length > 0 ? createdAccount[0] : undefined
  }

  async findByUserId(userId: number): Promise<Account | undefined> {
    return await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    })
  }

  async findOneById(accountId: number): Promise<Account | undefined> {
    return await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    })
  }

  async updateBalance(id: number, newBalance: number): Promise<void> {
    await db.update(accounts).set({ balance: newBalance }).where(eq(accounts.id, id))
  }
}
