import { CreateBudgetForm, CreateBudgetFormData } from "@/src/accounts/components/create-budget-form/create-budget-form"

interface Props {
  initialValues: CreateBudgetFormData
  onContinue: (data: CreateBudgetFormData) => void
}

export const OnboardingCreateBudget = ({ initialValues, onContinue }: Props) => {
  return (
    <div className='flex w-full flex-col'>
      <h1 className='text-2xl font-semibold text-shades-500'>Create Your Budget</h1>
      <p className='mt-1 font-medium text-shades-300'>
        Pick a budget that suits your style. Our monthly budgets are divided into three categories.
      </p>
      <ol className='mt-4 flex list-disc flex-col gap-2 pl-4 text-sm text-gray-500'>
        <li>
          <span className='font-semibold'>Needed for Living:</span> Essentials like rent, groceries, and bills.
        </li>
        <li>
          <span className='font-semibold'>Savings/Investments:</span> Set aside money for your future goals.
        </li>
        <li>
          <span className='font-semibold'>Entertainment:</span> Have fun without breaking the bank.
        </li>
      </ol>
      <CreateBudgetForm initialValues={initialValues} onSubmit={onContinue} />
    </div>
  )
}
