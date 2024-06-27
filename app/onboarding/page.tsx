"use client"

import { Button } from "@/src/misc"
import { Icon } from "@/src/misc/components/icons/icon"
import { trpc } from "@/src/utils/_trpc/client"
import { getErrorMessage } from "@/src/utils/errors/get-error-message"
import { AppRoutes } from "@/src/utils/routes"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { mutateAsync: onboardUser } = trpc.users.onboardUser.useMutation()

  const handleOnboardUser = async () => {
    try {
      await onboardUser({})
      router.push(AppRoutes.dashboard)
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }

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
          <Icon icon='newspaper' />
          <p className='pl-2'>Create your first account</p>
        </li>
        <li className='flex items-center'>
          <Icon icon='bank-notes' />
          <p className='pl-2'>Select your budget</p>
        </li>
        <li className='flex items-center'>
          <Icon icon='sparkles' />
          <p className='pl-2'>{`You're all set`}</p>
        </li>
      </ol>

      <Button className='mt-3' onClick={handleOnboardUser}>
        Get started
      </Button>
    </div>
  )
}
