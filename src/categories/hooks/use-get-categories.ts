import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import { useSession } from "next-auth/react"
import { Category } from "../types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const useGetCategories = (transactionTypeId: number) => {
  const { data: session } = useSession()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }

    const fetchCategories = async (userId: number) => {
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
    }

    fetchCategories(session.user.id)
  }, [session?.user?.id, transactionTypeId])

  return { categories }
}
