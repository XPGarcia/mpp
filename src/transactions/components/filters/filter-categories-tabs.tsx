import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/ui-lib/components/ui/tabs"
import { FilterCategoryOptions } from "./filter-category-options"
import { useState } from "react"
import { Category, WithSpend } from "@/modules/transactions/domain"

interface Props {
  incomeCategories?: WithSpend<Category>[]
  expenseCategories?: WithSpend<Category>[]
  onFilterChange: (categoriesIds: number[]) => void
}

export const FilterCategoriesTabs = ({ incomeCategories, expenseCategories, onFilterChange }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const changeFilter = (categoriesIds: number[]) => {
    setSelectedCategories(() => [...categoriesIds])
    onFilterChange(categoriesIds)
  }

  return (
    <Tabs defaultValue='income' className='mt-6 w-full'>
      <TabsList>
        <TabsTrigger value='income'>Income</TabsTrigger>
        <TabsTrigger value='expenses'>Expenses</TabsTrigger>
      </TabsList>

      <TabsContent value='income'>
        <FilterCategoryOptions
          categories={incomeCategories}
          selectedCategories={selectedCategories}
          onFilterSelected={changeFilter}
        />
      </TabsContent>

      <TabsContent value='expenses'>
        <FilterCategoryOptions
          categories={expenseCategories}
          selectedCategories={selectedCategories}
          onFilterSelected={changeFilter}
        />
      </TabsContent>
    </Tabs>
  )
}
