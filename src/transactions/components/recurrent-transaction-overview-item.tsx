import dayjs from "dayjs"
import { CheckCircle2 } from "lucide-react"

import { Transaction } from "@/modules/transactions/domain"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { isExpense } from "@/utils"

interface Props {
  transaction: Transaction
}

export const RecurrentTransactionOverviewItem = ({ transaction }: Props) => {
  return (
    <div className='border-b border-secondary first:border-t'>
      <div className='flex items-center justify-between px-4 py-5'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{dayjs(transaction.date).format("DD/MM/YYYY")}</p>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
            <span className='text-xs text-muted-foreground'>Paid {dayjs(transaction.date).format("DD/MM/YYYY")}</span>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-semibold'>
            {isExpense(transaction.type) ? "-" : ""}
            {formatNumberToMoney(transaction.amount)}
          </span>
        </div>
      </div>
    </div>
  )
}
