import { Icon } from "@/src/misc/components/icons/icon"
import { LoadingIcon } from "@/src/misc/components/icons/loading-icon"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { SpendingType, SpendingTypeToLabel } from "@/src/transactions/types"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { calculatePercentage, calculatePercentageFromTotal } from "@/src/utils/math"
import { Fragment } from "react"

type ExpenseDistribution = {
  total: number
  percentage: number
}

interface Props {
  spendingType: SpendingType
  totalIncome: number
  budget: number
  expenseDistribution: ExpenseDistribution
  date: {
    month: string
    year: string
  }
}

const getPercentage = (budget: number, expenseDistribution: ExpenseDistribution) => {
  if (expenseDistribution.percentage > 0) {
    return calculatePercentageFromTotal(budget, expenseDistribution.percentage)
  }

  return expenseDistribution.total > 0 ? 100 : 0 // show 100% if there's no budget but there's spending
}

export const BudgetSpendingTypeProgress = ({ spendingType, budget, totalIncome, expenseDistribution, date }: Props) => {
  const label = SpendingTypeToLabel[spendingType]

  const percentage = getPercentage(budget, expenseDistribution)
  const maxToSpend = totalIncome > 0 ? calculatePercentage(totalIncome, budget) : 0

  const colorScheme = percentage > 80 ? "bg-red-500" : percentage > 40 ? "bg-yellow-500" : "bg-blue-500"

  const { value: showCategories, toggle: toggleCategories } = useBoolean(false)

  const { data: categories, isLoading: isLoadingCategories } =
    trpc.categories.findManyBySpendTypeWithTotalSpend.useQuery({ spendingType, date }, { enabled: showCategories })

  const getOrderedCategoriesWithPercentage = () => {
    const orderedCategories = categories?.sort((a, b) => b.totalSpend - a.totalSpend)
    const biggestCategory = orderedCategories?.[0] // there must be at least one because total is > 0
    return orderedCategories?.map((category) => {
      if (!biggestCategory) return { ...category, percentage: 0 }
      const percentage =
        category.id === biggestCategory.id
          ? 100
          : calculatePercentageFromTotal(biggestCategory.totalSpend, category.totalSpend)
      return { ...category, percentage }
    })
  }

  const mappedCategories = getOrderedCategoriesWithPercentage() ?? []

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
      {expenseDistribution.total > 0 && (
        <div className='mt-2 px-4'>
          <div className='flex items-center text-xs text-gray-500 hover:cursor-pointer' onClick={toggleCategories}>
            <p className='mr-1'>View details</p>
            <Icon icon='chevron-down' size='sm' />
          </div>
          {showCategories && !isLoadingCategories && (
            <div className='grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-2 py-2'>
              {mappedCategories.map((category) => (
                <Fragment key={category.id}>
                  <div className='text-right'>
                    <p>{category.name}</p>
                    <p className='text-xxs text-gray-400'>{formatNumberToMoney(category.totalSpend)}</p>
                  </div>
                  <div key={category.id} className='mt-1'>
                    <div className='relative h-2.5 w-full rounded-full'>
                      <div
                        className={`h-2.5 rounded-full bg-shades-500`}
                        style={{ width: `${category.percentage > 100 ? 100 : category.percentage}%` }}
                      />
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          )}
          {showCategories && isLoadingCategories && (
            <div className='mt-2 flex w-full justify-center text-shades-500'>
              <Icon icon='loading' size='lg' />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
