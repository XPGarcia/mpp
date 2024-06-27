import { Button } from "@/src/misc"

interface Props {
  onContinue: () => void
}

export const OnboardingReview = ({ onContinue }: Props) => {
  return (
    <div className='flex w-full flex-col'>
      <h1 className='text-2xl font-semibold text-shades-500'>{`You're All Set!`}</h1>
      <p className='mt-1 font-medium text-shades-300'>
        Your budget is ready to roll. Dive in and start taking control of your money today!
      </p>
      <Button className='mt-4' onClick={onContinue}>{`Let's do this!`}</Button>
    </div>
  )
}
