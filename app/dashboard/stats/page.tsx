"use client"

import { BudgetSpendingTypeProgress } from "@/src/accounts/components/budget-spending-type-progress/budget-spending-type-progress"
import { MonthPicker, MonthPickerDate } from "@/src/misc/components/month-picker/month-picker"
import { SpendingType } from "@/src/transactions/types"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import dayjs from "dayjs"
import { useState } from "react"

export default function Stats() {
  const [date, setDate] = useState<MonthPickerDate>({
    month: dayjs(new Date()).format("MM"),
    year: dayjs(new Date()).format("YYYY"),
  })

  const { data: transactionDistribution } = trpc.budgets.getMonthlyExpensesDistribution.useQuery({
    month: date.month,
    year: date.year,
  })
  const { data: budget } = trpc.budgets.findOneByUserId.useQuery()

  return (
    <main className='pt-4'>
      <MonthPicker defaultValue={`${date.year}-${date.month}`} onChange={setDate} />
      <div className='my-6 flex flex-col items-center'>
        <p>{`Your total income this month is`}</p>
        <p className='pt-2 text-2xl font-semibold'>{formatNumberToMoney(transactionDistribution?.totalIncome)}</p>
      </div>
      <div className='flex flex-col'>
        {!!transactionDistribution && !!budget && (
          <div className='flex flex-col gap-6'>
            <BudgetSpendingTypeProgress
              spendingType={SpendingType.NECESSITY}
              totalIncome={transactionDistribution.totalIncome}
              budget={budget.necessity}
              expenseDistribution={transactionDistribution.expensesDistribution.NECESSITY}
            />
            <BudgetSpendingTypeProgress
              spendingType={SpendingType.SAVINGS}
              totalIncome={transactionDistribution.totalIncome}
              budget={budget.savings}
              expenseDistribution={transactionDistribution.expensesDistribution.SAVINGS}
            />
            <BudgetSpendingTypeProgress
              spendingType={SpendingType.LUXURY}
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
