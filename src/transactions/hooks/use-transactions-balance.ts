import { useEffect, useState } from "react"
import { Transaction } from "../types"
import { useSession } from "next-auth/react"
import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import toast from "react-hot-toast"
import { calculateBalance } from "../actions/calculate-balance"

export const useTransactionsBalance = () => {
  const { data: session } = useSession()

  const [balance, setBalance] = useState({ income: 0, expenses: 0, total: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }

    const fetchCategories = async (userId: number) => {
      try {
        const { data, error } = await HttpClient.get<Transaction[]>(ApiRoutes.getTransactions(userId))
        if (error) {
          throw new Error(error)
        }

        if (!data) {
          throw new Error("Transactions data is not defined")
        }

        const { income, expenses, total } = calculateBalance(data)
        setBalance(() => ({ income, expenses, total }))
        setTransactions(data.map((transaction) => ({ ...transaction, date: new Date(transaction.date) })))
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong while fetching transactions")
      }
    }

    fetchCategories(session.user.id)
  }, [session?.user?.id])

  return { balance, transactions }
}
