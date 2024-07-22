import { recurrentTransactions } from "@/db/schema"
import { RecurrentTransaction } from "../types"
import { getTransactionFrequencyFromId } from "@/src/utils/mappers/transaction-frequency-mappers"

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
    return dbRecurrentTransactions.map(
      (dbRecurrentTransaction) => this.toDomain(dbRecurrentTransaction) as RecurrentTransaction
    )
  }
}
