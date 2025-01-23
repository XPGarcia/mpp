import { Button } from "@/src/ui-lib/components/ui/button"

interface Props {
  isLoading: boolean
  onFinish: () => void
}

export const OnboardingReview = ({ isLoading, onFinish }: Props) => {
  return (
    <div className='flex w-full flex-col'>
      <h1 className='text-2xl font-semibold text-shades-500'>{`You're All Set!`}</h1>
      <p className='mt-1 font-medium text-shades-300'>
        Your budget is ready to roll. Dive in and start taking control of your money today!
      </p>
      <Button className='mt-4' onClick={onFinish} isLoading={isLoading}>{`Let's do this!`}</Button>
    </div>
  )
}
