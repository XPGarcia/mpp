const TYPES = {
  /*********** Accounts **********/
  // repositories
  AccountRepository: Symbol.for("AccountRepository"),
  AccountBalanceEntryRepository: Symbol.for("AccountBalanceEntryRepository"),
  BudgetRepository: Symbol.for("BudgetRepository"),
  // use-cases
  GetAccountBalanceEntryByDate: Symbol.for("GetAccountBalanceEntryByDate"),
  GetUserAccount: Symbol.for("GetUserAccount"),
  FindOneAccountBalanceEntryByAccountAndDate: Symbol.for("FindOneAccountBalanceEntryByAccountAndDate"),
  CreateOneAccountBalanceEntry: Symbol.for("CreateOneAccountBalanceEntry"),
  CreateOneAccount: Symbol.for("CreateOneAccount"),
  CreateOneBudget: Symbol.for("CreateOneBudget"),
  FindOneBudgetByUserId: Symbol.for("FindOneBudgetByUserId"),
  /*********** Accounts **********/

  /*********** Transactions **********/
  // repositories
  TransactionRepository: Symbol.for("TransactionRepository"),
  RecurrentTransactionRepository: Symbol.for("RecurrentTransactionRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  // services
  AccountsService: Symbol.for("AccountsService"),
  AccountBalanceEntriesService: Symbol.for("AccountBalanceEntriesService"),
  // use-cases
  GetMonthlyExpensesDistributionForUser: Symbol.for("GetMonthlyExpensesDistributionForUser"),
  UpdateAccountBalance: Symbol.for("UpdateAccountBalance"),
  CreateCategoryForUser: Symbol.for("CreateCategoryForUser"),
  CreateInitialCategoriesForUser: Symbol.for("CreateInitialCategoriesForUser"),
  DeleteOneCategory: Symbol.for("DeleteOneCategory"),
  GetUserCategoriesBySpendingType: Symbol.for("GetUserCategoriesBySpendingType"),
  UpdateOneCategory: Symbol.for("UpdateOneCategory"),
  GetUserCategoriesByTransaction: Symbol.for("GetUserCategoriesByTransaction"),
  /*********** Transactions **********/

  /*********** Users **********/
  // repositories
  UserRepository: Symbol.for("UserRepository"),
  FeedbackRepository: Symbol.for("FeedbackRepository"),
  // use-cases
  SubmitFeedback: Symbol.for("SubmitFeedback"),
  /*********** Users **********/
}

export { TYPES }
