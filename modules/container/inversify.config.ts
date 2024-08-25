import { Container } from "inversify"
import { TYPES } from "./types"
import { AccountRepository } from "@/modules/accounts/domain"
import { DrizzleAccountBalanceEntryRepository, DrizzleAccountRepository } from "@/modules/accounts/infra"
import {
  CreateOneAccountBalanceEntry,
  GetAccountBalanceEntryByDate,
  GetUserAccount,
  UpdateAmountAccountBalanceEntry,
} from "@/modules/accounts/use-cases"
import { RecurrentTransactionRepository, TransactionRepository } from "@/modules/transactions/domain"
import { DrizzleRecurrentTransactionRepository, DrizzleTransactionRepository } from "@/modules/transactions/infra"
import { GetMonthlyExpensesDistributionForUser } from "@/modules/transactions/use-cases"
import { FindOneAccountBalanceEntryByAccountAndDate } from "../accounts/use-cases/find-one-account-balance-entry-by-account-and-date"

const myContainer = new Container()

/*********** Accounts **********/
// repositories
myContainer.bind<AccountRepository>(TYPES.AccountRepository).to(DrizzleAccountRepository)
myContainer.bind(TYPES.AccountBalanceEntryRepository).to(DrizzleAccountBalanceEntryRepository)
// use-cases
myContainer.bind(TYPES.GetAccountBalanceEntryByDate).to(GetAccountBalanceEntryByDate)
myContainer.bind(TYPES.GetUserAccount).to(GetUserAccount)
myContainer.bind(TYPES.UpdateAmountAccountBalanceEntry).to(UpdateAmountAccountBalanceEntry)
myContainer.bind(TYPES.FindOneAccountBalanceEntryByAccountAndDate).to(FindOneAccountBalanceEntryByAccountAndDate)
myContainer.bind(TYPES.CreateOneAccountBalanceEntry).to(CreateOneAccountBalanceEntry)
/*********** Accounts **********/

/*********** Transactions **********/
// repositories
myContainer.bind<TransactionRepository>(TYPES.TransactionRepository).to(DrizzleTransactionRepository)
myContainer
  .bind<RecurrentTransactionRepository>(TYPES.RecurrentTransactionRepository)
  .to(DrizzleRecurrentTransactionRepository)
// use-cases
myContainer.bind(TYPES.GetMonthlyExpensesDistributionForUser).to(GetMonthlyExpensesDistributionForUser)
/*********** Transactions **********/

export { myContainer }
