"use client"

import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { LoadingIcon } from "@/src/misc/components/icons/loading-icon"
import { TransactionRow } from "@/src/transactions/components/transaction-row"
import { Transaction, TransactionType } from "@/src/transactions/types"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { getTransactionTypeId } from "@/src/utils/get-transaction-type-id"
import { AppRoutes } from "@/src/utils/routes"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChangeEvent, Fragment, useState } from "react"

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const [yearMonth, setYearMonth] = useState<string>(dayjs(new Date()).format("YYYY-MM"))
  const range = {
    month: yearMonth.split("-")[1],
    year: yearMonth.split("-")[0],
  }

  const { data, isLoading } = trpc.transactions.getUserTransactionsWithBalance.useQuery(
    { month: range.month, year: range.year },
    {
      enabled: Boolean(session?.user?.id),
    }
  )

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  const groupTransactionsByDate = (transactions?: Transaction[]): { [key: string]: Transaction[] } => {
    const groupedTransactionsByDate: { [key: string]: Transaction[] } = {}

    for (const transaction of transactions ?? []) {
      const formattedDate = dayjs(transaction.date).format("YYYY-MM-DD")
      if (!groupedTransactionsByDate[formattedDate]) {
        groupedTransactionsByDate[formattedDate] = []
      }
      groupedTransactionsByDate[formattedDate].push(transaction)
    }

    return groupedTransactionsByDate
  }

  const groupedTransactionsByDate = groupTransactionsByDate(data?.transactions)

  const handleChangeMonth = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === yearMonth) {
      return
    }
    setYearMonth(value)
  }

  return (
    <main className='flex w-full flex-col'>
      <div className='pt-3'>
        <input
          type='month'
          value={yearMonth}
          max={dayjs(new Date()).format("YYYY-MM")}
          className='block h-[30px] w-fit rounded-md border border-shades-50 bg-white px-2 text-xs text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:border-blue-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:outline-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:px-5'
          onChange={handleChangeMonth}
        />
      </div>
      {isLoading && (
        <div className='mt-10 flex items-center justify-center'>
          <LoadingIcon className='size-10' />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          <div className='flex w-full justify-between px-8 pt-3'>
            <div className='block text-center'>
              <p className='mb-0.5 text-xs font-medium text-shades-300'>Income</p>
              <p className='text-xs font-bold text-blue-500'>{formatNumberToMoney(data?.balance.income)}</p>
            </div>
            <div className='block text-center'>
              <p className='mb-0.5 text-xs font-medium text-shades-300'>Expenses</p>
              <p className='text-xs font-bold text-red-500'>{formatNumberToMoney(data?.balance.expenses)}</p>
            </div>
            <div className='block text-center'>
              <p className='mb-0.5 text-xs font-medium text-shades-300'>Total</p>
              <p className='text-xs font-bold text-shades-500'>{formatNumberToMoney(data?.balance.total)}</p>
            </div>
          </div>
          <div className='flex w-full flex-col gap-6 pt-6'>
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
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <FloatingAddButton onClick={addTransaction} />
        </Fragment>
      )}
    </main>
  )
}
