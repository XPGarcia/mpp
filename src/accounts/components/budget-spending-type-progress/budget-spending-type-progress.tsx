import { Loader2 } from "lucide-react"
import { Fragment, useState } from "react"

import { SpendingType } from "@/modules/transactions/types"
import { SpendingTypeToLabel } from "@/src/transactions/constants"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/ui-lib/components/ui/accordion"
import { Progress } from "@/src/ui-lib/components/ui/progress"
import { trpc } from "@/src/utils/_trpc/client"
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

  const colorScheme = percentage > 80 ? "bg-red-500" : percentage > 40 ? "bg-amber-500" : "bg-blue-500"

  const [showCategories, setShowCategories] = useState(false)
  const { data: categories, isLoading: isLoadingCategories } = trpc.categories.findUserCategoriesWithSpend.useQuery(
    { spendingTypes: [spendingType], date },
    { enabled: showCategories }
  )

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
      <Progress value={percentage} indicatorColor={colorScheme} />
      <p className='mt-1 text-xs font-light text-gray-600'>
        {`You've spent `}
        <span className='font-medium text-shades-500'>{formatNumberToMoney(expenseDistribution.total)}</span> on {label}
        , out of a <span className='font-medium text-shades-500'>{formatNumberToMoney(maxToSpend)}</span> (
        <span className='font-medium text-shades-500'>{budget}%</span> of your total income) budget.
      </p>
      {expenseDistribution.total > 0 && (
        <Accordion
          type='single'
          collapsible
          onValueChange={(value) => {
            setShowCategories(value !== "0")
          }}
        >
          <AccordionItem value='1' className='border-none'>
            <AccordionTrigger className='justify-start gap-1 hover:no-underline'>View details</AccordionTrigger>
            <AccordionContent>
              {!isLoadingCategories && (
                <div className='grid grid-cols-[1fr_auto] items-start gap-x-2 gap-y-2 py-2'>
                  {mappedCategories.map((category) => (
                    <Fragment key={category.id}>
                      <div key={category.id} className='mt-1 rotate-180'>
                        <Progress value={category.percentage} withBackground={false} />
                      </div>
                      <div className='text-left'>
                        <p>{category.name}</p>
                        <p className='text-xxs text-gray-400'>{formatNumberToMoney(category.totalSpend)}</p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
              {isLoadingCategories && (
                <div className='mt-2 flex w-full justify-center'>
                  <Loader2 className='animate-spin' />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
