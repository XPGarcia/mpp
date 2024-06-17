import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import { CreateTransactionFormData } from "../components/create-transaction-form"
import toast from "react-hot-toast"
import { Transaction } from "../types"
import { useSession } from "next-auth/react"

export const useCreateTransaction = () => {
  const { data: session } = useSession()

  const createTransaction = async (data: CreateTransactionFormData) => {
    try {
      const { data: createdTransaction, error } = await HttpClient.post<Transaction>(ApiRoutes.createTransaction, {
        ...data,
        userId: session?.user?.id ?? "",
      })
      if (error) {
        throw new Error(error)
      }
      if (!createdTransaction) {
        throw new Error("Failed to create transaction")
      }

      return createdTransaction
    } catch (error) {
      console.error(error)
      toast.error("Failed to create transaction")
    }
  }

  return { createTransaction }
}
