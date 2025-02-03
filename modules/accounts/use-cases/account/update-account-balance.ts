import { inject, injectable } from "inversify"

import { AccountBalanceEntry, AccountBalanceEntryRepository, AccountRepository } from "@/modules/accounts/domain"
import { TYPES } from "@/modules/container/types"
import { NotFoundError } from "@/src/utils/errors/errors"

export type UpdateAccountBalanceInput = {
  accountBalanceEntry: AccountBalanceEntry
  amount: number
}

export type UpdateAccountBalanceOutput = Promise<void>

export interface UpdateAccountBalanceUseCase {
  execute(input: UpdateAccountBalanceInput): UpdateAccountBalanceOutput
}

@injectable()
export class UpdateAccountBalance implements UpdateAccountBalanceUseCase {
  @inject(TYPES.AccountRepository) _accountRepository!: AccountRepository
  @inject(TYPES.AccountBalanceEntryRepository) _accountBalanceEntryRepository!: AccountBalanceEntryRepository

  async execute(input: UpdateAccountBalanceInput): UpdateAccountBalanceOutput {
    const { accountBalanceEntry, amount } = input
    const account = await this._accountRepository.findOneById(accountBalanceEntry.accountId)
    if (!account) {
      throw new NotFoundError(`Account with balance entry ID ${accountBalanceEntry.id} not found`)
    }

    const updatedBalanceEntryAmount = accountBalanceEntry.amount + amount
    const updatedAccountBalance = account.balance + amount

    await Promise.all([
      this._accountBalanceEntryRepository.updateAmount(accountBalanceEntry.id, updatedBalanceEntryAmount),
      this._accountRepository.updateBalance(accountBalanceEntry.accountId, updatedAccountBalance),
    ])
  }
}
