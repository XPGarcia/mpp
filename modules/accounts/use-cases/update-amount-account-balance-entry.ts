import { NotFoundError } from "@/src/utils/errors/errors"
import { inject, injectable } from "inversify"
import { AccountBalanceEntry, AccountBalanceEntryRepository, AccountRepository } from "@/modules/accounts/domain"
import { TYPES } from "@/modules/container/types"

export type UpdateAmountAccountBalanceEntryInput = {
  accountBalanceEntry: AccountBalanceEntry
  amount: number
}

export type UpdateAmountAccountBalanceEntryOutput = Promise<void>

export interface UpdateAmountAccountBalanceEntryUseCase {
  execute(input: UpdateAmountAccountBalanceEntryInput): UpdateAmountAccountBalanceEntryOutput
}

@injectable()
export class UpdateAmountAccountBalanceEntry implements UpdateAmountAccountBalanceEntryUseCase {
  @inject(TYPES.AccountRepository) private readonly _accountRepository!: AccountRepository
  @inject(TYPES.AccountBalanceEntryRepository)
  private readonly _accountBalanceEntryRepository!: AccountBalanceEntryRepository

  async execute(input: UpdateAmountAccountBalanceEntryInput): UpdateAmountAccountBalanceEntryOutput {
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
