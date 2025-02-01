import { ProgressCircle } from "@/src/misc/components/progress-circle/progress-circle"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"

type Payload = {
  selectedAmount: number
  percentage: number
}

interface FiltersHeaderTotalsProps {
  income: Payload
  expenses: Payload
}

export const FiltersHeaderTotals = ({ income, expenses }: FiltersHeaderTotalsProps) => {
  const { selectedAmount: selectedIncome, percentage: percentageIncome } = income
  const { selectedAmount: selectedExpenses, percentage: percentageExpenses } = expenses
  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-2'>
        <ProgressCircle
          label='Income'
          percentage={percentageIncome}
          amount={formatNumberToMoney(selectedIncome) ?? "0.00"}
          color={{
            base: "text-blue-500/50",
            accent: "text-blue-500",
          }}
        />

        <ProgressCircle
          label='Expenses'
          percentage={percentageExpenses}
          amount={formatNumberToMoney(selectedExpenses) ?? "0.00"}
          color={{
            base: "text-red-500/50",
            accent: "text-red-500",
          }}
        />
      </div>

      <div className='flex justify-center'>
        <div className='font-light text-gray-400'>Total</div>
        <div className='ml-2 font-medium'>{formatNumberToMoney(selectedIncome - selectedExpenses)}</div>
      </div>
    </div>
  )
}
