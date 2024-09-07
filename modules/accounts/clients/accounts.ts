import { myContainer } from "@/modules/container/inversify.config"
import {
  CreateOneAccount,
  CreateOneAccountInput,
  GetAccountBalanceEntryByDate,
  GetAccountBalanceEntryByDateInput,
  GetUserAccount,
  GetUserAccountInput,
  UpdateAccountBalance,
  UpdateAccountBalanceInput,
} from "../use-cases"
import { TYPES } from "@/modules/container/types"

export const accountsClient = {
  getAccountBalanceEntryByDate: (input: GetAccountBalanceEntryByDateInput) => {
    const getAccountBalanceEntry = myContainer.get<GetAccountBalanceEntryByDate>(TYPES.GetAccountBalanceEntryByDate)
    return getAccountBalanceEntry.execute(input)
  },
  getUserAccount: (input: GetUserAccountInput) => {
    const getUserAccount = myContainer.get<GetUserAccount>(TYPES.GetUserAccount)
    return getUserAccount.execute(input)
  },
  updateBalance: (input: UpdateAccountBalanceInput) => {
    const updateAccountBalance = myContainer.get<UpdateAccountBalance>(TYPES.UpdateAccountBalance)
    return updateAccountBalance.execute(input)
  },
  createOne: (input: CreateOneAccountInput) => {
    const createOneAccount = myContainer.get<CreateOneAccount>(TYPES.CreateOneAccount)
    return createOneAccount.execute(input)
  },
}
