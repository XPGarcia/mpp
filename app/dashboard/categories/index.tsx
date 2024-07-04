import { useTransactionType } from "@/src/transactions/hooks/use-transaction-type"
import { trpc } from "@/src/utils/_trpc/client"

export default function CategoriesPage() {
  const { transactionType, setTransactionType } = useTransactionType()

  const { data: categories } = trpc.categories.findManyByUser.useQuery({ transactionType })

  return (
    <main>
      <h1>Categories</h1>
    </main>
  )
}
