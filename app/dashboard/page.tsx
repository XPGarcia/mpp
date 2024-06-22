"use client"

import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { useTransactionsBalance } from "@/src/transactions/hooks/use-transactions-balance"
import { Transaction, TransactionType } from "@/src/transactions/types"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { AppRoutes } from "@/src/utils/routes"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  const {
    balance: { income, expenses, total },
    transactions,
  } = useTransactionsBalance()

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  const groupTransactionsByDate = (transactions: Transaction[]): { [key: string]: Transaction[] } => {
    const groupedTransactionsByDate: { [key: string]: Transaction[] } = {}

    transactions.forEach((transaction) => {
      const formattedDate = dayjs(transaction.date).format("YYYY-MM-DD")
      if (!groupedTransactionsByDate[formattedDate]) {
        groupedTransactionsByDate[formattedDate] = []
      }
      groupedTransactionsByDate[formattedDate].push(transaction)
    })

    return groupedTransactionsByDate
  }

  const groupedTransactionsByDate = groupTransactionsByDate(transactions)

  return (
    <main className='flex w-full flex-col'>
      {" "}
      <div className='flex w-full justify-between px-8 pt-3'>
        <div className='block text-center'>
          <p className='mb-0.5 text-xs font-medium text-shades-300'>Income</p>
          <p className='text-xs font-bold text-blue-500'>{formatNumberToMoney(income)}</p>
        </div>
        <div className='block text-center'>
          <p className='mb-0.5 text-xs font-medium text-shades-300'>Expenses</p>
          <p className='text-xs font-bold text-red-500'>{formatNumberToMoney(expenses)}</p>
        </div>
        <div className='block text-center'>
          <p className='mb-0.5 text-xs font-medium text-shades-300'>Total</p>
          <p className='text-xs font-bold text-shades-500'>{formatNumberToMoney(total)}</p>
        </div>
      </div>
      <div className='flex w-full flex-col gap-6 px-4 pt-6'>
        {Object.keys(groupedTransactionsByDate).map((date) => {
          const transactions = groupedTransactionsByDate[date]
          const transactionsTotal = transactions.reduce((acc, transaction) => {
            const amount =
              transaction.typeId === getTransactionTypeId(TransactionType.INCOME)
                ? transaction.amount
                : transaction.amount * -1

            return acc + amount
          }, 0)
          const isPositive = transactionsTotal >= 0
          return (
            <div key={date}>
              <div className='flex items-center justify-between border-b border-gray-100 pb-2'>
                <p className='text-sm font-semibold text-shades-100'>{dayjs(date).format("DD MMM YYYY")}</p>
                <span
                  className={`${isPositive ? "bg-blue-500" : "bg-red-500"} rounded-sm px-1.5 py-0.5 text-xs font-semibold text-white`}
                >
                  {formatNumberToMoney(isPositive ? transactionsTotal : transactionsTotal * -1)}
                </span>
              </div>

              <div className='flex flex-col gap-2 pt-2'>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className='flex w-full justify-between'>
                    <div>
                      <p className='text-sm font-medium'>{transaction.category?.name ?? ""}</p>
                      {transaction.description && (
                        <p className='text-sm font-light text-shades-50'>{transaction.description}</p>
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium ${transaction.type === TransactionType.INCOME ? "text-blue-500" : "text-red-500"}`}
                    >
                      {formatNumberToMoney(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <FloatingAddButton onClick={addTransaction} />
    </main>
  )
}
