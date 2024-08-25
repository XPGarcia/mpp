import { myContainer } from "@/modules/container/inversify.config"
import { GetAccountBalanceEntryByDate, GetAccountBalanceEntryByDateInput } from "../use-cases"
import { TYPES } from "@/modules/container/types"

const getAccountBalanceEntry = myContainer.get<GetAccountBalanceEntryByDate>(TYPES.GetAccountBalanceEntryByDate)

export const accountsClient = {
  getAccountBalanceEntryByDate: (input: GetAccountBalanceEntryByDateInput) => getAccountBalanceEntry.execute(input),
}
