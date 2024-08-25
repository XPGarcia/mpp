import { myContainer } from "@/modules/container/inversify.config"
import { TYPES } from "@/modules/container/types"
import {
  CreateOneAccountBalanceEntry,
  CreateOneAccountBalanceEntryInput,
  FindOneAccountBalanceEntryByAccountAndDate,
  FindOneAccountBalanceEntryByAccountAndDateInput,
} from "../use-cases"

const findOneAccountBalanceEntryByAccountAndDate = myContainer.get<FindOneAccountBalanceEntryByAccountAndDate>(
  TYPES.FindOneAccountBalanceEntryByAccountAndDate
)

const createOneAccountBalanceEntry = myContainer.get<CreateOneAccountBalanceEntry>(TYPES.CreateOneAccountBalanceEntry)

export const accountBalanceEntriesClient = {
  findOneByAccountAndDate: (input: FindOneAccountBalanceEntryByAccountAndDateInput) =>
    findOneAccountBalanceEntryByAccountAndDate.execute(input),
  createOne: (input: CreateOneAccountBalanceEntryInput) => createOneAccountBalanceEntry.execute(input),
}
