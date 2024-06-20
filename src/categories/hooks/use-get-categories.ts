import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import { useSession } from "next-auth/react"
import { Category } from "../types"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

export const useGetCategories = (transactionTypeId: number) => {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = useCallback(
    async (userId: number) => {
      try {
        const { data, error } = await HttpClient.get<Category[]>(
          ApiRoutes.userCategoriesByTransaction(userId, transactionTypeId)
        )
        if (error) {
          throw new Error(error)
        }

        if (!data) {
          throw new Error("Categories data is not defined")
        }

        setCategories(data)
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong while fetching categories")
      }
    },
    [transactionTypeId]
  )

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }

    fetchCategories(session.user.id)
  }, [session?.user?.id, fetchCategories])

  const refetch = () => {
    if (session?.user?.id) {
      fetchCategories(session.user.id)
    }
  }

  return { categories, refetch }
}
