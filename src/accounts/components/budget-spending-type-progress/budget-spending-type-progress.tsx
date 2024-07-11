import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { calculatePercentage, calculatePercentageFromTotal } from "@/src/utils/math"

interface Props {
  title: string
  totalIncome: number
  budget: number
  expenseDistribution: {
    total: number
    percentage: number
  }
}

export const BudgetSpendingTypeProgress = ({ title, budget, totalIncome, expenseDistribution }: Props) => {
  const percentage = calculatePercentageFromTotal(budget, expenseDistribution.percentage)
  const maxToSpend = calculatePercentage(totalIncome, budget)

  const colorScheme = percentage > 80 ? "bg-red-500" : percentage > 40 ? "bg-yellow-500" : "bg-blue-500"

  return (
    <div className='flex flex-col text-xs font-medium text-shades-500'>
      <div className='mb-1 flex justify-between'>
        <p>{title}</p>
        <p className='self-end'>{formatNumberToMoney(maxToSpend)}</p>
      </div>
      <div className='relative mb-6 h-2.5 w-full rounded-full bg-gray-200'>
        <div
          className={`h-2.5 rounded-full ${colorScheme}`}
          style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
        />
        <p
          className='absolute mt-1 self-end text-xs font-medium'
          style={{ left: `${percentage > 100 ? 93 : percentage - 4}%` }}
        >
          {`${percentage}%`}
        </p>
      </div>
    </div>
  )
}
