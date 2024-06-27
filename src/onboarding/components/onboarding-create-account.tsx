import {
  CreateAccountForm,
  CreateAccountFormData,
} from "@/src/accounts/components/create-account-form/create-account-form"

interface Props {
  initialValues: CreateAccountFormData
  onContinue: (data: CreateAccountFormData) => void
}

export const OnboardingCreateAccount = ({ initialValues, onContinue }: Props) => {
  return (
    <div className='flex w-full flex-col'>
      <h1 className='text-2xl font-semibold text-shades-500'>Create Your First Account</h1>
      <p className='mt-1 font-medium text-shades-300'>
        Set up your primary account to kick things off. This is the first step on your journey to financial freedom.
      </p>
      <CreateAccountForm initialValues={initialValues} onSubmit={onContinue} />
    </div>
  )
}
