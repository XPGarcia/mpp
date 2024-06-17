import { db } from "@/db"
import { Transaction } from "../types"
import { transactions } from "@/db/schema"

export class TransactionRepository {
  static async createOne(input: any): Promise<Transaction> {
    const rows = await db.insert(transactions).values(input).returning()
    return rows[0]
  }
}
