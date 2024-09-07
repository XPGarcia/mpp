import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateOneAccountBalanceEntry,
  CreateOneAccountBalanceEntryInput,
  FindOneAccountBalanceEntryByAccountAndDate,
  FindOneAccountBalanceEntryByAccountAndDateInput,
} from "../use-cases"

export const accountBalanceEntriesClient = {
  findOneByAccountAndDate: (input: FindOneAccountBalanceEntryByAccountAndDateInput) => {
    const findOneAccountBalanceEntryByAccountAndDate = myContainer.get<FindOneAccountBalanceEntryByAccountAndDate>(
      TYPES.FindOneAccountBalanceEntryByAccountAndDate
    )
    return findOneAccountBalanceEntryByAccountAndDate.execute(input)
  },
  createOne: (input: CreateOneAccountBalanceEntryInput) => {
    const createOneAccountBalanceEntry = myContainer.get<CreateOneAccountBalanceEntry>(
      TYPES.CreateOneAccountBalanceEntry
    )
    return createOneAccountBalanceEntry.execute(input)
  },
}
