"use client"

import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { Transaction, TransactionType } from "../types"
import { Button } from "@/src/misc"
import { Icon } from "@/src/misc/components/icons/icon"
import { useRouter } from "next/navigation"
import { AppRoutes } from "@/src/utils/routes"
import { useState } from "react"

interface Props {
  transaction: Transaction
}

export const TransactionRow = ({ transaction }: Props) => {
  const router = useRouter()
  const [actionsOpen, setActionsOpen] = useState(false)

  const toggleActions = () => {
    setActionsOpen(!actionsOpen)
  }

  const onUpdateClicked = () => {
    setActionsOpen(false)
    router.push(AppRoutes.updateTransaction(transaction.id))
  }

  return (
    <div key={transaction.id} className='flex'>
      <div className='flex w-full justify-between' onClick={toggleActions}>
        <div>
          <p className='text-sm font-medium'>{transaction.category?.name ?? ""}</p>
          {transaction.description && <p className='text-sm font-light text-shades-50'>{transaction.description}</p>}
        </div>
        <p
          className={`text-sm font-medium ${transaction.type === TransactionType.INCOME ? "text-blue-500" : "text-red-500"}`}
        >
          {formatNumberToMoney(transaction.amount)}
        </p>
      </div>
      {actionsOpen && (
        <div>
          <Button
            size='sm'
            style={{ padding: "0 8px", borderRadius: "8px 0 0 8px" }}
            className='ml-2 h-full'
            onClick={onUpdateClicked}
          >
            <Icon icon='pencil' size='sm' />
          </Button>
        </div>
      )}
    </div>
  )
}
