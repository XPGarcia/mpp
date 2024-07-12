import { accountBalanceEntries } from "@/db/schema"
import { AccountBalanceEntry } from "../types/account"
import { db } from "@/db"
import { and, eq, gte, lte } from "drizzle-orm"

type CreateAccountBalanceEntryInput = typeof accountBalanceEntries.$inferInsert

const DEFAULT_SELECT = {
  id: accountBalanceEntries.id,
  accountId: accountBalanceEntries.accountId,
  amount: accountBalanceEntries.amount,
}

export class AccountBalanceEntryRepository {
  static async findOneByAccountAndDate(accountId: number, date: Date): Promise<AccountBalanceEntry | undefined> {
    const balanceEntry = await db
      .select(DEFAULT_SELECT)
      .from(accountBalanceEntries)
      .where(
        and(
          eq(accountBalanceEntries.accountId, accountId),
          and(lte(accountBalanceEntries.dateFrom, date), gte(accountBalanceEntries.dateTo, date))
        )
      )
    return balanceEntry.length > 0 ? balanceEntry[0] : undefined
  }

  static async createOne(input: CreateAccountBalanceEntryInput): Promise<AccountBalanceEntry | undefined> {
    const createdEntry = await db.insert(accountBalanceEntries).values(input).returning(DEFAULT_SELECT)
    return createdEntry.length > 0 ? createdEntry[0] : undefined
  }

  static async updateAmount(id: number, newAmount: number): Promise<void> {
    await db.update(accountBalanceEntries).set({ amount: newAmount }).where(eq(accountBalanceEntries.id, id))
  }
}
