"use client"

import { Button } from "@/src/misc"
import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { useTransactionsBalance } from "@/src/transactions/hooks/use-transactions-balance"
import { TransactionType } from "@/src/transactions/types"
import { AppRoutes } from "@/src/utils/routes"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MouseEvent } from "react"

export default function Home() {
  const router = useRouter()

  const logout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await signOut()
  }

  const {
    balance: { income, expenses, total },
    transactions,
  } = useTransactionsBalance()

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  return (
    <main className='flex w-full justify-center p-4'>
      <div className='flex w-full max-w-slim flex-col'>
        <div className='flex w-full justify-between px-8 pt-6'>
          <div className='block text-center'>
            <p className='mb-0.5 text-xs font-medium text-shades-300'>Income</p>
            <p className='text-xs font-bold text-blue-500'>{income.toFixed(2)}</p>
          </div>
          <div className='block text-center'>
            <p className='mb-0.5 text-xs font-medium text-shades-300'>Expenses</p>
            <p className='text-xs font-bold text-red-500'>{expenses.toFixed(2)}</p>
          </div>
          <div className='block text-center'>
            <p className='mb-0.5 text-xs font-medium text-shades-300'>Total</p>
            <p className='text-xs font-bold text-shades-500'>{total.toFixed(2)}</p>
          </div>
        </div>
        <div className='flex w-full flex-col gap-2 px-4 pt-6'>
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
                {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Button className='mt-6' onClick={logout}>
          Logout
        </Button>
        <FloatingAddButton onClick={addTransaction} />
      </div>
    </main>
  )
}
