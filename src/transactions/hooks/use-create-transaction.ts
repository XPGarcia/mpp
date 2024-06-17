import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import { CreateTransactionFormData } from "../components/create-transaction-form"
import toast from "react-hot-toast"
import { Transaction } from "../types"

export const useCreateTransaction = () => {
  const createTransaction = async (data: CreateTransactionFormData) => {
    try {
      const { data: createdTransaction, error } = await HttpClient.post<Transaction>(ApiRoutes.createTransaction, data)
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
