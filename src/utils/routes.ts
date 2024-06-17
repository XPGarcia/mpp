export const ApiRoutes = {
  register: "/api/register",
  userCategoriesByTransaction: (userId: number, transactionTypeId: number) =>
    `/api/categories?userId=${userId}&transactionTypeId=${transactionTypeId}`,
  createTransaction: "/api/transactions",
}

export const AppRoutes = {
  addTransaction: "/transactions/add",
}
