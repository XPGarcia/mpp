import dayjs from "dayjs"
import { inject,injectable } from "inversify"

import { AccountBalanceEntry } from "@/modules/accounts/domain"
import { AccountBalanceEntryRepository, AccountRepository } from "@/modules/accounts/domain/repos"
import { TYPES } from "@/modules/container/types"
import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"

export type GetAccountBalanceEntryByDateInput = { userId: number; date: Date }

export type GetAccountBalanceEntryByDateOutput = Promise<AccountBalanceEntry>

export interface GetAccountBalanceEntryByDateUseCase {
  execute(input: GetAccountBalanceEntryByDateInput): GetAccountBalanceEntryByDateOutput
}

@injectable()
export class GetAccountBalanceEntryByDate implements GetAccountBalanceEntryByDateUseCase {
  @inject(TYPES.AccountRepository) private readonly _accountRepository!: AccountRepository
  @inject(TYPES.AccountBalanceEntryRepository)
  private readonly _accountBalanceEntryRepository!: AccountBalanceEntryRepository

  async execute(input: GetAccountBalanceEntryByDateInput): GetAccountBalanceEntryByDateOutput {
    const { userId, date } = input
    const account = await this._accountRepository.findByUserId(userId)
    if (!account) {
      throw new NotFoundError(`Account not found for user ${userId}`)
    }
    const balanceEntry = await this._accountBalanceEntryRepository.findOneByAccountAndDate(account.id, date)
    if (!!balanceEntry) {
      return balanceEntry
    }

    const firstDayOfCurrentMonth = dayjs(date).startOf("month").toDate()
    const lastDayOfCurrentMonth = dayjs(date).endOf("month").toDate()

    const currentDate = dayjs(firstDayOfCurrentMonth).format("YYYY-MM")

    const newBalanceEntry = await this._accountBalanceEntryRepository.createOne({
      accountId: account.id,
      amount: 0,
      description: `Account Balance entry for ${currentDate}`,
      dateFrom: firstDayOfCurrentMonth,
      dateTo: lastDayOfCurrentMonth,
    })
    if (!newBalanceEntry) {
      throw new InternalServerError("Error while creating a new Account Balance Entry")
    }

    return newBalanceEntry
  }
}
