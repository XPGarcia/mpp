import dayjs from "dayjs"
import { CheckCircle2, History } from "lucide-react"

import { Transaction } from "@/modules/transactions/domain"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { isExpense } from "@/utils"

interface Props {
  transaction: Transaction
  isPending?: boolean
}

export const RecurrentTransactionOverviewItem = ({ transaction, isPending = false }: Props) => {
  return (
    <div className={`border-b border-secondary first:border-t ${isPending ? "bg-secondary" : ""}`}>
      <div className='flex items-center justify-between px-4 py-5'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{dayjs(transaction.date).format("DD/MM/YYYY")}</p>
          {isPending && (
            <div className='flex items-center gap-2 text-blue-500'>
              <History className='h-4 w-4' />
              <span className='text-xs'>Due in {dayjs(transaction.date).diff(dayjs(), "day")}</span>
            </div>
          )}
          {!isPending && (
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
              <span className='text-xs text-muted-foreground'>
                Paid {dayjs(transaction.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
          )}
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
