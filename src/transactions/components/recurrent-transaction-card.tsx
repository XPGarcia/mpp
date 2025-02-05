import dayjs from "dayjs"

import { RecurrentTransaction, TransactionFrequency } from "@/modules/transactions/domain"
import { Card } from "@/src/ui-lib/components/ui/card"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { isIncome } from "@/utils"

interface Props {
  type?: "default" | "detailed"
  recurrentTransaction: RecurrentTransaction
}

const frequencyLabelMapper: Record<TransactionFrequency, string> = {
  [TransactionFrequency.DAILY]: "Every day",
  [TransactionFrequency.WEEKLY]: "Every week",
  [TransactionFrequency.MONTHLY]: "Every month",
  [TransactionFrequency.YEARLY]: "Every year",
}

const getInitials = (text: string): string => {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const DefaultCard = ({ recurrentTransaction }: Props) => {
  return (
    <Card className='p-4'>
      <div className='truncate font-semibold'>{recurrentTransaction.description}</div>
      <div className='mt-2 flex items-start gap-4'>
        {recurrentTransaction.category && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-primary-foreground ${
              isIncome(recurrentTransaction.type)
                ? "bg-gradient-to-br from-indigo-600 to-blue-500"
                : "bg-gradient-to-br from-red-500 to-orange-500"
            }`}
          >
            {getInitials(recurrentTransaction.category.name)}
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-medium'>{recurrentTransaction.category?.name}</p>
          <p className='text-xs text-muted-foreground'>{frequencyLabelMapper[recurrentTransaction.frequency]}</p>
        </div>
        <div className='text-right'>
          <p className='text-sm font-medium'>
            {isIncome(recurrentTransaction.type) ? "" : "-"}
            {formatNumberToMoney(recurrentTransaction.amount)}
          </p>
          <p className='text-xs text-muted-foreground'>{dayjs(recurrentTransaction.nextDate).format("DD/MM/YYYY")}</p>
        </div>
      </div>
    </Card>
  )
}

const DetailedCard = ({ recurrentTransaction }: Props) => {
  return (
    <Card className='p-4'>
      <div className='flex flex-row items-start justify-between space-y-0'>
        <div className='flex gap-3'>
          {recurrentTransaction.category && (
            <div
              className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-primary-foreground ${
                isIncome(recurrentTransaction.type)
                  ? "bg-gradient-to-br from-indigo-600 to-blue-500"
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              }`}
            >
              {getInitials(recurrentTransaction.category.name)}
            </div>
          )}
          <div>
            <p className='font-medium'>{recurrentTransaction.category?.name}</p>
            <p className='text-sm text-muted-foreground'>{frequencyLabelMapper[recurrentTransaction.frequency]}</p>
            <p className='text-sm text-muted-foreground'>{recurrentTransaction.account?.name}</p>
          </div>
        </div>
        <p className='font-medium'>
          {isIncome(recurrentTransaction.type) ? "" : "-"}
          {formatNumberToMoney(recurrentTransaction.amount)}
        </p>
      </div>
    </Card>
  )
}

export const RecurrentTransactionCard = (props: Props) => {
  if (props.type === "detailed") {
    return <DetailedCard {...props} />
  }

  return <DefaultCard {...props} />
}
