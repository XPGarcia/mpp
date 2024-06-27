import { accounts } from "@/db/schema"
import { Account } from "../types/account"
import { db } from "@/db"

type CreateAccountInput = typeof accounts.$inferInsert

export class AccountRepository {
  static async create(data: CreateAccountInput): Promise<Account | null> {
    const createdAccount = await db.insert(accounts).values(data).returning()
    return createdAccount.length > 0 ? createdAccount[0] : null
  }
}
