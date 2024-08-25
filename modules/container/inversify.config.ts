import { Container } from "inversify"
import { TYPES } from "./types"
import { AccountRepository } from "@/modules/accounts/domain"
import {
  DrizzleAccountBalanceEntryRepository,
  DrizzleAccountRepository,
  DrizzleBudgetRepository,
} from "@/modules/accounts/infra"
import {
  CreateOneAccount,
  CreateOneAccountBalanceEntry,
  GetAccountBalanceEntryByDate,
  GetUserAccount,
  UpdateAmountAccountBalanceEntry,
  FindOneAccountBalanceEntryByAccountAndDate,
  FindOneBudgetByUserId,
} from "@/modules/accounts/use-cases"
import { RecurrentTransactionRepository, TransactionRepository } from "@/modules/transactions/domain"
import { DrizzleRecurrentTransactionRepository, DrizzleTransactionRepository } from "@/modules/transactions/infra"
import { GetMonthlyExpensesDistributionForUser } from "@/modules/transactions/use-cases"

const myContainer = new Container()

/*********** Accounts **********/
// repositories
myContainer.bind<AccountRepository>(TYPES.AccountRepository).to(DrizzleAccountRepository)
myContainer.bind(TYPES.AccountBalanceEntryRepository).to(DrizzleAccountBalanceEntryRepository)
myContainer.bind(TYPES.BudgetRepository).to(DrizzleBudgetRepository)
// use-cases
myContainer.bind(TYPES.GetAccountBalanceEntryByDate).to(GetAccountBalanceEntryByDate)
myContainer.bind(TYPES.GetUserAccount).to(GetUserAccount)
myContainer.bind(TYPES.UpdateAmountAccountBalanceEntry).to(UpdateAmountAccountBalanceEntry)
myContainer.bind(TYPES.FindOneAccountBalanceEntryByAccountAndDate).to(FindOneAccountBalanceEntryByAccountAndDate)
myContainer.bind(TYPES.CreateOneAccountBalanceEntry).to(CreateOneAccountBalanceEntry)
myContainer.bind(TYPES.CreateOneAccount).to(CreateOneAccount)
myContainer.bind(TYPES.FindOneBudgetByUserId).to(FindOneBudgetByUserId)
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
