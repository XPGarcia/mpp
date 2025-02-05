"use client"

import { useRouter } from "next/navigation"

import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { RecurrentTransactionCard } from "@/src/transactions/components/recurrent-transaction-card"
import { trpc } from "@/src/utils/_trpc/client"
import { AppRoutes } from "@/src/utils/routes"

export default function RecurrentTransactionsPage() {
  const router = useRouter()

  const { data: recurrentTransactions } = trpc.transactions.findUserRecurrentTransactions.useQuery()

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  const editRecurrentTransaction = (id: number) => {
    router.push(AppRoutes.editRecurrentTransaction(id))
  }

  return (
    <main className='px-2 py-3'>
      <header className='mb-6 flex items-center justify-between'>
        <h1 className='text-xl font-semibold tracking-tight'>Recurrent transactions</h1>
      </header>
      <div className='space-y-4'>
        {recurrentTransactions?.map((recurrentTransaction) => (
          <div
            key={recurrentTransaction.id}
            className='cursor-pointer'
            onClick={() => editRecurrentTransaction(recurrentTransaction.id)}
          >
            <RecurrentTransactionCard recurrentTransaction={recurrentTransaction} />
          </div>
        ))}
      </div>
      <FloatingAddButton onClick={addTransaction} />
    </main>
  )
}
