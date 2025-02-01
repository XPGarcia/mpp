import { Dialog, DialogContent } from "@/src/ui-lib/components/ui/dialog"
import useMediaQuery from "@/src/ui-lib/hooks/use-media-query"
import { Drawer, DrawerClose, DrawerContent } from "@/src/ui-lib/components/ui/drawer"
import { FiltersHeaderTotals } from "./filters-header-totals"
import { trpc } from "@/src/utils/_trpc/client"
import { TransactionType } from "@/modules/transactions/domain"
import { DialogTitle } from "@radix-ui/react-dialog"
import { FilterCategoriesTabs } from "./filter-categories-tabs"
import { MonthPickerDate } from "@/src/misc/components/month-picker/month-picker"
import { useState } from "react"
import { Button } from "@/src/ui-lib/components/ui/button"

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

  const { mutateAsync: getBalances } = trpc.transactions.getBalance.useMutation()

  const changeTotals = async (categoriesIds: number[]) => {
    if (categoriesIds.length === 0) {
      setTotals(initialTotals)
      return
    }
    const balances = await getBalances({
      categoriesIds,
      date,
    })
    const incomePercentage = Math.round((balances.filteredBalance.income * 100) / balances.totalBalance.income)
    const expensesPercentage = Math.round((balances.filteredBalance.expenses * 100) / balances.totalBalance.expenses)
    setTotals({
      income: { percentage: incomePercentage, selectedAmount: balances.filteredBalance.income },
      expenses: { percentage: expensesPercentage, selectedAmount: balances.filteredBalance.expenses },
    })
    setSelectedCategories(() => [...categoriesIds])
  }

  const applyFilters = () => {
    onAccept(selectedCategories)
    onClose()
  }

  return (
    <div className='scroll-y flex h-[90vh] flex-col overflow-y-auto py-2'>
      <div className='flex w-full justify-end bg-secondary p-1'>
        <Button variant='default' className='h-[28px]' onClick={applyFilters}>
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
