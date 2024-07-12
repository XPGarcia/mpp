import { accountBalanceEntries, accounts } from "@/db/schema"
import { Account, BalanceEntry } from "../types/account"
import { db } from "@/db"
import { and, eq, gte, lte } from "drizzle-orm"

type CreateAccountBalanceEntryInput = typeof accountBalanceEntries.$inferInsert

const DEFAULT_SELECT = {
  id: accountBalanceEntries.id,
  accountId: accountBalanceEntries.accountId,
  amount: accountBalanceEntries.amount,
}

export class BalanceEntryRepository {
  static async findOneByAccountAndDate(accountId: number, date: Date): Promise<BalanceEntry | undefined> {
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

  static async createOne(input: CreateAccountBalanceEntryInput): Promise<BalanceEntry | undefined> {
    const createdEntry = await db.insert(accountBalanceEntries).values(input).returning()
    return createdEntry.length > 0 ? createdEntry[0] : undefined
  }

  static async updateAmount(id: number, newAmount: number): Promise<void> {
    await db.update(accountBalanceEntries).set({ amount: newAmount }).where(eq(accountBalanceEntries.id, id))
  }
}
