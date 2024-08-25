import {
  FindOneAccountBalanceEntryByAccountAndDateInput,
  FindOneAccountBalanceEntryByAccountAndDateOutput,
} from "@/modules/accounts/use-cases"

export interface AccountsBalanceEntriesService {
  findOneByAccountAndDate(
    input: FindOneAccountBalanceEntryByAccountAndDateInput
  ): FindOneAccountBalanceEntryByAccountAndDateOutput
}
