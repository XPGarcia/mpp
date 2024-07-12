import { NotFoundError } from "@/src/utils/errors/errors"
import { AccountBalanceEntryRepository } from "../repositories/account-balance-entry-repository"
import { AccountBalanceEntry } from "../types/account"
import { AccountRepository } from "../repositories/account-repository"

interface Params {
  accountBalanceEntry: AccountBalanceEntry
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
    AccountBalanceEntryRepository.updateAmount(accountBalanceEntry.id, updatedBalanceEntryAmount),
    AccountRepository.updateBalance(accountBalanceEntry.accountId, updatedAccountBalance),
  ])
}
