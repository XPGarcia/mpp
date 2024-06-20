import { HttpClient } from "@/src/utils/http-client/http-client"
import { ApiRoutes } from "@/src/utils/routes"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { CreateCategoryFormData } from "../components/create-category-form/create-category-form"
import { Category } from "../types"

export const useCreateCategoryForUser = () => {
  const { data: session } = useSession()

  const createCategoryForUser = async (data: CreateCategoryFormData) => {
    try {
      const { data: createdCategory, error } = await HttpClient.post<Category>(ApiRoutes.createCategoryForUser, {
        ...data,
        userId: session?.user?.id ?? "",
      })
      if (error) {
        throw new Error(error)
      }
      if (!createdCategory) {
        throw new Error("Failed to create category")
      }

      return createdCategory
    } catch (error) {
      console.error(error)
      toast.error("Failed to create category")
    }
  }

  return { createCategoryForUser }
}
