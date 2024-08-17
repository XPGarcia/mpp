import { TransactionType } from "@/modules/transactions/types"
import { Button } from "@/src/misc"
import { isExpense, isIncome } from "@/utils"

interface Props {
  selectedType: TransactionType
  onIsIncomeClicked: () => void
  onIsExpenseClicked: () => void
}

export const SelectTransactionType = ({ selectedType, onIsIncomeClicked, onIsExpenseClicked }: Props) => {
  return (
    <div className='flex w-full justify-center gap-3'>
      <Button size='sm' variant={isIncome(selectedType) ? "solid" : "outline"} onClick={onIsIncomeClicked}>
        Income
      </Button>
      <Button size='sm' variant={isExpense(selectedType) ? "solid" : "outline"} onClick={onIsExpenseClicked}>
        Expense
      </Button>
    </div>
  )
}
