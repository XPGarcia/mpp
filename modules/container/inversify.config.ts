import "reflect-metadata"

import { Container } from "inversify"

import { AccountBalanceEntryRepository, AccountRepository, BudgetRepository } from "@/modules/accounts/domain"
import {
  DrizzleAccountBalanceEntryRepository,
  DrizzleAccountRepository,
  DrizzleBudgetRepository,
} from "@/modules/accounts/infra"
import {
  CreateOneAccount,
  CreateOneAccountBalanceEntry,
  CreateOneBudget,
  FindOneAccountBalanceEntryByAccountAndDate,
  FindOneBudgetByUserId,
  GetAccountBalanceEntryByDate,
  GetUserAccount,
  UpdateAccountBalance,
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
  CreateTransaction,
  CreateTransactionFromRecurrent,
  DeleteOneCategory,
  DeleteRecurrentTransaction,
  DeleteTransaction,
  FindRecurrentTransaction,
  FindTransaction,
  FindUserCategoriesWithSpend,
  FindUserRecurrentTransactions,
  FindUserTransactions,
  GenerateRecurrentTransactions,
  GetMonthlyExpensesDistributionForUser,
  GetUserCategoriesByTransaction,
  UpdateOneCategory,
  UpdateRecurrentTransaction,
  UpdateTransaction,
} from "@/modules/transactions/use-cases"
import { FeedbackRepository, UserRepository } from "@/modules/users/domain"
import { DrizzleFeedbackRepository, DrizzleUserRepository } from "@/modules/users/infra"
import { ImplEmailService } from "@/modules/users/infra"
import {
  CreateUser,
  FindOneUserById,
  Login,
  SendVerificationEmail,
  SubmitFeedback,
  UpdateUser,
  VerifyOTP,
} from "@/modules/users/use-cases"

import { TYPES } from "./types"

const myContainer = new Container()

/*********** Accounts **********/
// repositories
myContainer.bind<AccountRepository>(TYPES.AccountRepository).to(DrizzleAccountRepository)
myContainer
  .bind<AccountBalanceEntryRepository>(TYPES.AccountBalanceEntryRepository)
  .to(DrizzleAccountBalanceEntryRepository)
myContainer.bind<BudgetRepository>(TYPES.BudgetRepository).to(DrizzleBudgetRepository)
// use-cases
myContainer.bind(TYPES.GetAccountBalanceEntryByDate).to(GetAccountBalanceEntryByDate)
myContainer.bind(TYPES.GetUserAccount).to(GetUserAccount)
myContainer.bind(TYPES.UpdateAccountBalance).to(UpdateAccountBalance)
myContainer.bind(TYPES.FindOneAccountBalanceEntryByAccountAndDate).to(FindOneAccountBalanceEntryByAccountAndDate)
myContainer.bind(TYPES.CreateOneAccountBalanceEntry).to(CreateOneAccountBalanceEntry)
myContainer.bind(TYPES.CreateOneAccount).to(CreateOneAccount)
myContainer.bind(TYPES.FindOneBudgetByUserId).to(FindOneBudgetByUserId)
myContainer.bind(TYPES.CreateOneBudget).to(CreateOneBudget)
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
myContainer.bind(TYPES.UpdateOneCategory).to(UpdateOneCategory)
myContainer.bind(TYPES.GetUserCategoriesByTransaction).to(GetUserCategoriesByTransaction)
myContainer.bind(TYPES.CreateTransaction).to(CreateTransaction)
myContainer.bind(TYPES.CreateTransactionFromRecurrent).to(CreateTransactionFromRecurrent)
myContainer.bind(TYPES.GenerateRecurrentTransactions).to(GenerateRecurrentTransactions)
myContainer.bind(TYPES.DeleteTransaction).to(DeleteTransaction)
myContainer.bind(TYPES.UpdateRecurrentTransaction).to(UpdateRecurrentTransaction)
myContainer.bind(TYPES.UpdateTransaction).to(UpdateTransaction)
myContainer.bind(TYPES.FindTransaction).to(FindTransaction)
myContainer.bind(TYPES.FindUserTransactions).to(FindUserTransactions)
myContainer.bind(TYPES.FindUserCategoriesWithSpend).to(FindUserCategoriesWithSpend)
myContainer.bind(TYPES.FindUserRecurrentTransactions).to(FindUserRecurrentTransactions)
myContainer.bind(TYPES.FindRecurrentTransaction).to(FindRecurrentTransaction)
myContainer.bind(TYPES.DeleteRecurrentTransaction).to(DeleteRecurrentTransaction)
/*********** Transactions **********/

/*********** Users **********/
// repositories
myContainer.bind<FeedbackRepository>(TYPES.FeedbackRepository).to(DrizzleFeedbackRepository)
myContainer.bind<UserRepository>(TYPES.UserRepository).to(DrizzleUserRepository)
// services
myContainer.bind(TYPES.EmailService).to(ImplEmailService)
// use-cases
myContainer.bind(TYPES.SubmitFeedback).to(SubmitFeedback)
myContainer.bind(TYPES.CreateUser).to(CreateUser)
myContainer.bind(TYPES.Login).to(Login)
myContainer.bind(TYPES.FindOneUserById).to(FindOneUserById)
myContainer.bind(TYPES.UpdateUser).to(UpdateUser)
myContainer.bind(TYPES.SendVerificationEmail).to(SendVerificationEmail)
myContainer.bind(TYPES.VerifyOTP).to(VerifyOTP)
/*********** Users **********/

export { myContainer }
