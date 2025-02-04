"use client"
import dayjs from "dayjs"
import { Filter, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Fragment, useState } from "react"

import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { MonthPicker, MonthPickerDate } from "@/src/misc/components/month-picker/month-picker"
import { useBoolean } from "@/src/misc/hooks/use-boolean"
import { FiltersDialogDrawer } from "@/src/transactions/components/filters/filters-dialog-drawer"
import { TransactionRow } from "@/src/transactions/components/transaction-row"
import { Button } from "@/src/ui-lib/components/ui/button"
import { trpc } from "@/src/utils/_trpc/client"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"
import { AppRoutes } from "@/src/utils/routes"
import { groupTransactionsByDate, isIncome } from "@/utils"

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { value: isFilterOpen, on: openFilter, off: closeFilter } = useBoolean(false)

  const [date, setDate] = useState<MonthPickerDate>({
    month: dayjs(new Date()).format("MM"),
    year: dayjs(new Date()).format("YYYY"),
  })
  const [categoriesIds, setCategoriesIds] = useState<number[]>([])

  const {
    data,
    refetch: refetchTransactions,
    isLoading,
  } = trpc.transactions.findUserTransactionsWithBalance.useQuery(
    { date, categoriesIds },
    {
      enabled: Boolean(session?.user?.id),
    }
  )

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  const deleteTransaction = () => {
    refetchTransactions()
  }

  const changeFilters = (categoriesIds: number[]) => {
    setCategoriesIds(() => [...categoriesIds])
  }

  const groupedTransactionsByDate = groupTransactionsByDate(data?.transactions ?? [], "YYYY-MM-DD")

  return (
    <main className='flex w-full flex-col'>
      <div className='flex items-center justify-between pt-3'>
        <MonthPicker onChange={setDate} />
        <Button variant='outline' size='icon' onClick={openFilter}>
          <Filter />
        </Button>
      </div>
      {(isLoading || !data?.transactions) && (
        <div className='mt-10 flex items-center justify-center'>
          <Loader2 className='size-10 animate-spin' />
        </div>
      )}
      {!isLoading && !!data?.transactions && (
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
      <FiltersDialogDrawer isOpen={isFilterOpen} date={date} onClose={closeFilter} onAccept={changeFilters} />
    </main>
  )
}
