import { TransactionType } from "@/modules/transactions/types"
import { Button } from "@/src/ui-lib/components/ui/button"
import { isExpense, isIncome } from "@/utils"

interface Props {
  selectedType: TransactionType
  onIsIncomeClicked: () => void
  onIsExpenseClicked: () => void
}

export const SelectTransactionType = ({ selectedType, onIsIncomeClicked, onIsExpenseClicked }: Props) => {
  return (
    <div className='flex w-full justify-center gap-3'>
      <Button size='sm' variant={isIncome(selectedType) ? "default" : "outline"} onClick={onIsIncomeClicked}>
        Income
      </Button>
      <Button size='sm' variant={isExpense(selectedType) ? "default" : "outline"} onClick={onIsExpenseClicked}>
        Expense
      </Button>
    </div>
  )
}
