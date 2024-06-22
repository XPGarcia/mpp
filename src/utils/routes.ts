export const ApiRoutes = {
  register: "/api/register",
  userCategoriesByTransaction: (userId: number, transactionTypeId: number) =>
    `/api/categories?userId=${userId}&transactionTypeId=${transactionTypeId}`,
  createTransaction: "/api/transactions",
  getTransactions: (userId: number) => `/api/transactions?userId=${userId}`,
  createCategoryForUser: "/api/categories/createForUser",
}

const appRoot = "/dashboard"
export const AppRoutes = {
  login: "/login",
  register: "/sign-up",
  dashboard: appRoot,
  accounts: `${appRoot}/accounts`,
  stats: `${appRoot}/stats`,
  options: `${appRoot}/options`,
  addTransaction: `${appRoot}/transactions/add`,
}
