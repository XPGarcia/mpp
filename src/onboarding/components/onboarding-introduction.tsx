import { Button } from "@/src/ui-lib/components/ui/button"
import { Banknote, Newspaper, WandSparkles } from "lucide-react"

interface Props {
  onContinue: () => void
}

export const OnboardingIntroduction = ({ onContinue }: Props) => {
  return (
    <div className='flex w-full flex-col justify-center'>
      <div>
        <h1 className='text-shades-primary text-3xl font-bold'>Welcome to MPP!</h1>
        <h3 className='text-xl font-medium text-shades-300'>{`We're thrilled to have you join us!`}</h3>
      </div>
      <p className='my-4 text-sm font-light text-gray-400'>
        MPP is all about making personal finance and budgeting simple and stress-free. Whether {`you're`} saving up for
        something big or just want to stay on top of your spending, {`we've`} got your back.
      </p>

      <p className='font-medium text-shades-300'>{`Let's get started:`}</p>
      <ol className='flex flex-col gap-3 py-2 pl-4'>
        <li className='flex items-center'>
          <Newspaper size={16} />
          <p className='pl-2'>Create your first account</p>
        </li>
        <li className='flex items-center'>
          <Banknote size={16} />
          <p className='pl-2'>Select your budget</p>
        </li>
        <li className='flex items-center'>
          <WandSparkles size={16} />
          <p className='pl-2'>{`You're all set`}</p>
        </li>
      </ol>

      <Button className='mt-3' onClick={onContinue}>
        Get started
      </Button>
    </div>
  )
}
