import { DialogTitle } from "@radix-ui/react-dialog"
import { Filter } from "lucide-react"
import { useState } from "react"

import { TransactionType } from "@/modules/transactions/domain"
import { MonthPickerDate } from "@/src/misc/components/month-picker/month-picker"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Dialog, DialogContent } from "@/src/ui-lib/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent } from "@/src/ui-lib/components/ui/drawer"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"
import { trpc } from "@/src/utils/_trpc/client"

import { FilterCategoriesTabs } from "./filter-categories-tabs"
import { FiltersHeaderTotals } from "./filters-header-totals"

interface InnerProps {
  date: MonthPickerDate
  onClose: () => void
  onAccept: (categoriesIds: number[]) => void
}

const initialTotals = {
  income: { percentage: 0, selectedAmount: 0 },
  expenses: { percentage: 0, selectedAmount: 0 },
}

const InnerComponent = ({ date, onClose, onAccept }: InnerProps) => {
  const [totals, setTotals] = useState(initialTotals)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const { data: incomeCategories } = trpc.categories.findUserCategoriesWithSpend.useQuery({
    date,
    transactionTypes: [TransactionType.INCOME],
  })
  const { data: expenseCategories } = trpc.categories.findUserCategoriesWithSpend.useQuery({
    date,
    transactionTypes: [TransactionType.EXPENSE],
  })

  const { mutateAsync: getFilteredBalances } = trpc.transactions.getFilteredBalances.useMutation()

  const changeTotals = async (categoriesIds: number[]) => {
    if (categoriesIds.length === 0) {
      setTotals(initialTotals)
      return
    }
    const totals = await getTotals(date, categoriesIds)
    setTotals(totals)
    setSelectedCategories(() => [...categoriesIds])
  }

  const getTotals = async (date: MonthPickerDate, categoriesIds: number[]) => {
    const { totalBalance, filteredBalance } = await getFilteredBalances({
      categoriesIds,
      date,
    })
    const incomePercentage =
      totalBalance.income === 0 ? 0 : Math.round((filteredBalance.income * 100) / totalBalance.income)
    const expensesPercentage =
      totalBalance.expenses === 0 ? 0 : Math.round((filteredBalance.expenses * 100) / totalBalance.expenses)
    return {
      income: { percentage: incomePercentage, selectedAmount: filteredBalance.income },
      expenses: { percentage: expensesPercentage, selectedAmount: filteredBalance.expenses },
    }
  }

  const applyFilters = () => {
    onAccept(selectedCategories)
    onClose()
  }

  return (
    <div className='scroll-y flex h-[90vh] flex-col overflow-y-auto py-2'>
      <div className='flex w-full justify-end px-4 py-2'>
        <Button variant='default' className='h-[28px]' onClick={applyFilters}>
          <Filter />
          Filter
        </Button>
      </div>
      <div className='p-4'>
        <FiltersHeaderTotals income={totals.income} expenses={totals.expenses} />
        <FilterCategoriesTabs
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          onFilterChange={changeTotals}
        />
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  date: MonthPickerDate
  onClose: () => void
  onAccept: (categoriesIds: number[]) => void
}

export const FiltersDialogDrawer = ({ isOpen, date, onClose, onAccept }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='p-4 sm:max-w-[425px]'>
          <DialogTitle style={{ display: "none" }}>Select items that you want to filter.</DialogTitle>
          <InnerComponent date={date} onClose={onClose} onAccept={onAccept} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerClose />
      <DrawerContent>
        <DialogTitle style={{ display: "none" }}>Select items that you want to filter.</DialogTitle>
        <InnerComponent date={date} onClose={onClose} onAccept={onAccept} />
      </DrawerContent>
    </Drawer>
  )
}
