"use client"

import { Transaction } from "@/modules/transactions/types"
import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { LoadingIcon } from "@/src/misc/components/icons/loading-icon"
import { MonthPicker, MonthPickerDate } from "@/src/misc/components/month-picker/month-picker"
import { TransactionRow } from "@/src/transactions/components/transaction-row"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { AppRoutes } from "@/src/utils/routes"
import { groupTransactionsByDate, isIncome } from "@/utils"
import dayjs from "dayjs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const [date, setDate] = useState<MonthPickerDate>({
    month: dayjs(new Date()).format("MM"),
    year: dayjs(new Date()).format("YYYY"),
  })

  const {
    data,
    refetch: refetchTransactions,
    isLoading,
  } = trpc.transactions.getUserTransactionsWithBalance.useQuery(
    { month: date.month, year: date.year },
    {
      enabled: Boolean(session?.user?.id),
    }
  )

  const { data: account, refetch: refetchAccount } = trpc.accounts.findOneByUserId.useQuery()

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  const deleteTransaction = () => {
    refetchTransactions()
    refetchAccount()
  }

  const groupedTransactionsByDate = groupTransactionsByDate(data?.transactions ?? [], "YYYY-MM-DD")

  return (
    <main className='flex w-full flex-col'>
      <div className='flex justify-between pt-3'>
        <MonthPicker onChange={setDate} />
        <div className='flex flex-col justify-end text-right'>
          <p className='text-xxs'>Your current account balance</p>
          <p className='text-xs font-semibold'>{formatNumberToMoney(account?.balance ?? 0)}</p>
        </div>
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
                const amount = isIncome(transaction.type) ? transaction.amount : transaction.amount * -1
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
                      <TransactionRow key={transaction.id} transaction={transaction} onDelete={deleteTransaction} />
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
