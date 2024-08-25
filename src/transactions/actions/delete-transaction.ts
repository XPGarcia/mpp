import { isIncome } from "@/src/utils/get-transaction-type-id"
import { TransactionRepository } from "../repositories/transaction-repository"
import { updateAmountAccountBalanceEntry } from "@/src/accounts/actions/update-amount-account-balance-entry"
import { NotFoundError } from "@/src/utils/errors/errors"
import { accountsClient } from "@/modules/accounts"

interface DeleteTransactionInput {
  transactionId: number
}

export const deleteTransaction = async (input: DeleteTransactionInput) => {
  const transaction = await TransactionRepository.findOneById(input.transactionId)
  if (!transaction) {
    console.error("Transaction not found to delete", { input })
    throw new NotFoundError("Transaction not found to delete")
  }

  const accountBalanceEntry = await accountsClient.getAccountBalanceEntryByDate({
    userId: transaction.userId,
    date: transaction.date,
  })

  await TransactionRepository.deleteOne(transaction.id)

  const amount = isIncome(transaction.type) ? transaction.amount * -1 : transaction.amount
  await updateAmountAccountBalanceEntry({ accountBalanceEntry, amount })
}
