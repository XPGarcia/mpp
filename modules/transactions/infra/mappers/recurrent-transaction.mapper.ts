import { recurrentTransactions } from "@/db/schema"
import { RecurrentTransaction } from "@/modules/transactions/domain"

import { getTransactionFrequencyFromId } from "../utils"

type DrizzleRecurrentTransaction = typeof recurrentTransactions.$inferSelect

export class RecurrentTransactionMapper {
  static toDomain(dbRecurrentTransaction?: DrizzleRecurrentTransaction): RecurrentTransaction | undefined {
    if (!dbRecurrentTransaction) {
      return
    }

    const frequency = getTransactionFrequencyFromId(dbRecurrentTransaction.frequencyId)

    return {
      id: dbRecurrentTransaction.id,
      transactionId: dbRecurrentTransaction.transactionId,
      frequency,
      startDate: dbRecurrentTransaction.startDate,
      nextDate: dbRecurrentTransaction.nextDate,
    }
  }

  static toDomains(dbRecurrentTransactions: DrizzleRecurrentTransaction[]): RecurrentTransaction[] {
    return dbRecurrentTransactions
      .map((dbRecurrentTransaction) => this.toDomain(dbRecurrentTransaction))
      .filter((recurrentTransaction) => !!recurrentTransaction) as RecurrentTransaction[]
  }
}
