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
  UpdateAccountBalance,
  FindOneAccountBalanceEntryByAccountAndDate,
  FindOneBudgetByUserId,
} from "@/modules/accounts/use-cases"
import { RecurrentTransactionRepository, TransactionRepository } from "@/modules/transactions/domain"
import {
  DrizzleCategoryRepository,
  DrizzleRecurrentTransactionRepository,
  DrizzleTransactionRepository,
  ImplAccountBalanceEntriesService,
  ImplAccountsService,
} from "@/modules/transactions/infra"
import {
  CreateCategoryForUser,
  CreateInitialCategoriesForUser,
  DeleteOneCategory,
  GetMonthlyExpensesDistributionForUser,
  GetUserCategoriesBySpendingType,
  GetUserCategoriesByTransaction,
  UpdateOneCategory,
} from "@/modules/transactions/use-cases"
import { DrizzleFeedbackRepository } from "@/modules/users/infra"
import { SubmitFeedback } from "@/modules/users/use-cases"

const myContainer = new Container()

/*********** Accounts **********/
// repositories
myContainer.bind<AccountRepository>(TYPES.AccountRepository).to(DrizzleAccountRepository)
myContainer.bind(TYPES.AccountBalanceEntryRepository).to(DrizzleAccountBalanceEntryRepository)
myContainer.bind(TYPES.BudgetRepository).to(DrizzleBudgetRepository)
// use-cases
myContainer.bind(TYPES.GetAccountBalanceEntryByDate).to(GetAccountBalanceEntryByDate)
myContainer.bind(TYPES.GetUserAccount).to(GetUserAccount)
myContainer.bind(TYPES.UpdateAccountBalance).to(UpdateAccountBalance)
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
myContainer.bind(TYPES.CategoryRepository).to(DrizzleCategoryRepository)
// services
myContainer.bind(TYPES.AccountsService).to(ImplAccountsService)
myContainer.bind(TYPES.AccountBalanceEntriesService).to(ImplAccountBalanceEntriesService)
// use-cases
myContainer.bind(TYPES.GetMonthlyExpensesDistributionForUser).to(GetMonthlyExpensesDistributionForUser)
myContainer.bind(TYPES.CreateCategoryForUser).to(CreateCategoryForUser)
myContainer.bind(TYPES.CreateInitialCategoriesForUser).to(CreateInitialCategoriesForUser)
myContainer.bind(TYPES.DeleteOneCategory).to(DeleteOneCategory)
myContainer.bind(TYPES.GetUserCategoriesBySpendingType).to(GetUserCategoriesBySpendingType)
myContainer.bind(TYPES.UpdateOneCategory).to(UpdateOneCategory)
myContainer.bind(TYPES.GetUserCategoriesByTransaction).to(GetUserCategoriesByTransaction)
/*********** Transactions **********/

/*********** Users **********/
// repositories
myContainer.bind(TYPES.FeedbackRepository).to(DrizzleFeedbackRepository)
// use-cases
myContainer.bind(TYPES.SubmitFeedback).to(SubmitFeedback)
/*********** Users **********/

export { myContainer }
