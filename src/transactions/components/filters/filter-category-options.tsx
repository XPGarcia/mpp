import { Loader2 } from "lucide-react"
import { useState } from "react"

import { Category, WithSpend } from "@/modules/transactions/domain"
import { formatNumberToMoney } from "@/src/utils/format/format-to-money"

import { FilterOption } from "./filter-option"

interface Props {
  categories?: WithSpend<Category>[]
  selectedCategories: number[]
  onFilterSelected: (categoriesIds: number[]) => void
}

export const FilterCategoryOptions = ({ categories, selectedCategories, onFilterSelected }: Props) => {
  const [allSelected, setAllSelected] = useState(false)

  const selectAll = (isChecked: boolean) => {
    if (!categories) {
      return
    }
    if (isChecked) {
      const allCategoriesIds = categories.map((category) => category.id)
      const uniqueCategories = new Set([...selectedCategories, ...allCategoriesIds])
      onFilterSelected([...uniqueCategories])
      setAllSelected(true)
      return
    }
    const cleanedCategories = selectedCategories.filter((id) => !categories.map((category) => category.id).includes(id))
    onFilterSelected(cleanedCategories)
    setAllSelected(false)
  }

  const selectCategory = (categoryId: number, isChecked: boolean) => {
    if (!isChecked) {
      setAllSelected(false)
    }
    const newCategories = isChecked
      ? [...selectedCategories, categoryId]
      : [...selectedCategories.filter((id) => id !== categoryId)]
    onFilterSelected(newCategories)
  }

  const getTotalSpend = (category: WithSpend<Category>) => {
    if (category.totalSpend <= 0) {
      return
    }
    return formatNumberToMoney(category.totalSpend)
  }

  return (
    <>
      {categories && (
        <div className='border-none bg-transparent'>
          <div className='px-4'>
            <FilterOption id='all' defaultValue={allSelected} label='All' rightText='This month' onCheck={selectAll} />
            <div className='flex h-px w-full bg-secondary' />
            {categories.map((category) => (
              <FilterOption
                key={category.id}
                id={category.id.toString()}
                defaultValue={selectedCategories.includes(category.id)}
                label={category.name}
                onCheck={(isChecked) => selectCategory(category.id, isChecked)}
                rightText={getTotalSpend(category)}
              />
            ))}
          </div>
        </div>
      )}
      {!categories && (
        <div className='mt-10 flex items-center justify-center'>
          <Loader2 className='size-8 animate-spin' />
        </div>
      )}
    </>
  )
}
