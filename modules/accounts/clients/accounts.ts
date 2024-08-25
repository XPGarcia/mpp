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

const getAccountBalanceEntry = myContainer.get<GetAccountBalanceEntryByDate>(TYPES.GetAccountBalanceEntryByDate)
const getUserAccount = myContainer.get<GetUserAccount>(TYPES.GetUserAccount)
const updateAccountBalance = myContainer.get<UpdateAccountBalance>(TYPES.UpdateAccountBalance)
const createOneAccount = myContainer.get<CreateOneAccount>(TYPES.CreateOneAccount)

export const accountsClient = {
  getAccountBalanceEntryByDate: (input: GetAccountBalanceEntryByDateInput) => getAccountBalanceEntry.execute(input),
  getUserAccount: (input: GetUserAccountInput) => getUserAccount.execute(input),
  updateBalance: (input: UpdateAccountBalanceInput) => updateAccountBalance.execute(input),
  createOne: (input: CreateOneAccountInput) => createOneAccount.execute(input),
}
