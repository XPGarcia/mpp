"use client"

import { BudgetSpendingTypeProgress } from "@/src/accounts/components/budget-spending-type-progress/budget-spending-type-progress"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"

export default function Stats() {
  const { data: transactionDistribution } = trpc.budgets.getMonthlyExpensesDistribution.useQuery({
    month: "06",
    year: "2024",
  })
  const { data: budget } = trpc.budgets.findOneByUserId.useQuery()

  return (
    <main className='pt-4'>
      <div className='flex flex-col items-center'>
        <p>{`You're total income this month is`}</p>
        <p className='pt-2 text-2xl font-semibold'>{formatNumberToMoney(transactionDistribution?.totalIncome)}</p>
      </div>
      <div className='mt-8 flex flex-col'>
        {!!transactionDistribution && !!budget && (
          <div>
            <BudgetSpendingTypeProgress
              title='Necessity'
              totalIncome={transactionDistribution.totalIncome}
              budget={budget.necessity}
              expenseDistribution={transactionDistribution.expensesDistribution.NECESSITY}
            />
            <BudgetSpendingTypeProgress
              title='Savings'
              totalIncome={transactionDistribution.totalIncome}
              budget={budget.savings}
              expenseDistribution={transactionDistribution.expensesDistribution.SAVINGS}
            />
            <BudgetSpendingTypeProgress
              title='Entertainment'
              totalIncome={transactionDistribution.totalIncome}
              budget={budget.luxury}
              expenseDistribution={transactionDistribution.expensesDistribution.LUXURY}
            />
          </div>
        )}
      </div>
    </main>
  )
}
