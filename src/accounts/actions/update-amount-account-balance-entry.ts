import { NotFoundError } from "@/src/utils/errors/errors"
import { BalanceEntryRepository } from "../repositories/balance-entry-repository"
import { BalanceEntry } from "../types/account"
import { AccountRepository } from "../repositories/account-repository"

interface Params {
  accountBalanceEntry: BalanceEntry
  amount: number
}

export const updateAmountAccountBalanceEntry = async ({ accountBalanceEntry, amount }: Params) => {
  const account = await AccountRepository.findOneById(accountBalanceEntry.accountId)
  if (!account) {
    throw new NotFoundError(`Account with balance entry ID ${accountBalanceEntry.id} not found`)
  }

  const updatedBalanceEntryAmount = accountBalanceEntry.amount + amount
  const updatedAccountBalance = account.balance + amount

  await Promise.all([
    BalanceEntryRepository.updateAmount(accountBalanceEntry.id, updatedBalanceEntryAmount),
    AccountRepository.updateBalance(accountBalanceEntry.accountId, updatedAccountBalance),
  ])
}
