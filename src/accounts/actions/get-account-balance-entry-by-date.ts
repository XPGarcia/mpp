import { InternalServerError, NotFoundError } from "@/src/utils/errors/errors"
import { AccountRepository } from "../repositories/account-repository"
import { BalanceEntryRepository } from "../repositories/balance-entry-repository"
import dayjs from "dayjs"

interface GetAccountBalanceEntryByDateInput {
  userId: number
  date: Date
}

export const getAccountBalanceEntryByDate = async ({ userId, date }: GetAccountBalanceEntryByDateInput) => {
  const account = await AccountRepository.findByUserId(userId)
  if (!account) {
    throw new NotFoundError(`Account not Found for User ${userId}`)
  }
  const balanceEntry = await BalanceEntryRepository.findOneByAccountAndDate(account.id, date)
  if (!!balanceEntry) {
    return balanceEntry
  }

  const firstDayOfCurrentMonth = dayjs().startOf("month").toDate()
  const lastDayOfCurrentMonth = dayjs().endOf("month").toDate()

  const currentDate = dayjs(firstDayOfCurrentMonth).format("YYYY-MM")

  const newBalanceEntry = await BalanceEntryRepository.createOne({
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
