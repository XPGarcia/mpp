import { TransactionRepository } from "../repositories/transaction-repository"
import { Transaction } from "../types"
import { createTransactionFromRecurrent } from "./create-transaction-from-recurrent"

export const generateRecurrentTransactions = async () => {
  const recurrentTransactions = await TransactionRepository.findAllRecurrentForToday()
  if (recurrentTransactions.length === 0) {
    return []
  }

  const newTransactionsResponse = await Promise.allSettled(
    recurrentTransactions.map(async (recurrentTransaction) => {
      return await createTransactionFromRecurrent(recurrentTransaction)
    })
  )

  const createdTransactions: Transaction[] = []
  for (const response of newTransactionsResponse) {
    if (response.status === "rejected") {
      console.error("Failed to create transaction from recurrent", { response })
      continue
    }
    createdTransactions.push(response.value)
  }

  return createdTransactions
}
