const appRoot = "/dashboard"
export const AppRoutes = {
  login: "/login",
  register: "/sign-up",
  verifyEmail: "/verify-email",
  landing: "/",
  dashboard: appRoot,
  accounts: `${appRoot}/accounts`,
  stats: `${appRoot}/stats`,
  options: `${appRoot}/options`,
  addTransaction: `${appRoot}/transactions/add`,
  feedback: `${appRoot}/feedback`,
  onboarding: `/onboarding`,
  updateTransaction: (id: number) => `${appRoot}/transactions/${id}`,
  categories: `${appRoot}/categories`,
  recurrentTransactions: `${appRoot}/recurrent-transactions`,
  viewRecurrentTransaction: (id: number) => `${appRoot}/recurrent-transactions/${id}`,
  updateRecurrentTransaction: (id: number) => `${appRoot}/recurrent-transactions/${id}/update`,
}
