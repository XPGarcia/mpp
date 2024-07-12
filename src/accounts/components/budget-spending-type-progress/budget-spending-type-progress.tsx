import { SpendingType, SpendingTypeToLabel } from "@/src/transactions/types"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { calculatePercentage, calculatePercentageFromTotal } from "@/src/utils/math"

type ExpenseDistribution = {
  total: number
  percentage: number
}

interface Props {
  spendingType: SpendingType
  totalIncome: number
  budget: number
  expenseDistribution: ExpenseDistribution
}

const getPercentage = (budget: number, expenseDistribution: ExpenseDistribution) => {
  if (expenseDistribution.percentage > 0) {
    return calculatePercentageFromTotal(budget, expenseDistribution.percentage)
  }

  return expenseDistribution.total > 0 ? 100 : 0 // show 100% if there's no budget but there's spending
}

export const BudgetSpendingTypeProgress = ({ spendingType, budget, totalIncome, expenseDistribution }: Props) => {
  const label = SpendingTypeToLabel[spendingType]

  const percentage = getPercentage(budget, expenseDistribution)
  const maxToSpend = totalIncome > 0 ? calculatePercentage(totalIncome, budget) : 0

  const colorScheme = percentage > 80 ? "bg-red-500" : percentage > 40 ? "bg-yellow-500" : "bg-blue-500"

  return (
    <div className='flex flex-col text-xs font-medium text-shades-500'>
      <div className='mb-1 flex justify-between'>
        <p>{label}</p>
        <p className='self-end'>{formatNumberToMoney(maxToSpend)}</p>
      </div>
      <div className='relative mb-6 h-2.5 w-full rounded-full bg-gray-200'>
        <div
          className={`h-2.5 rounded-full ${colorScheme}`}
          style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
        />
        <p
          className='absolute mt-1 self-end text-xs font-medium'
          style={{ left: `${percentage >= 100 ? 92 : percentage <= 4 ? 0 : percentage - 4}%` }}
        >
          {`${percentage}%`}
        </p>
      </div>
      <p className='mt-1 text-xs font-light text-gray-600'>
        {`You've spent `}
        <span className='font-medium text-shades-500'>{formatNumberToMoney(expenseDistribution.total)}</span> on {label}
        , out of a <span className='font-medium text-shades-500'>{formatNumberToMoney(maxToSpend)}</span> (
        <span className='font-medium text-shades-500'>{budget}%</span> of your total income) budget.
      </p>
    </div>
  )
}
