"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/ui-lib/components/ui/card"
import { MailCheck } from "lucide-react"
import { Input } from "@/src/ui-lib/components/ui/input"
import { Button } from "@/src/ui-lib/components/ui/button"
import { trpc } from "@/src/utils/_trpc/client"
import { useRouter } from "next/navigation"
import { AppRoutes } from "@/src/utils/routes"
import { useToast } from "@/src/ui-lib/hooks/use-toast"

export default function VerifyEmail() {
  const router = useRouter()
  const { toast } = useToast()
  const [verificationCode, setVerificationCode] = useState("")

  const [timeLeft, setTimeLeft] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)

  const { mutateAsync: resendOTP } = trpc.users.resendOTP.useMutation()
  const { mutateAsync: verifyOTP, isPending: isVerifyingOTP } = trpc.users.verifyOTP.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await verifyOTP({ code: verificationCode })
    if (!isValid) {
      toast({ description: "Invalid verification code", variant: "destructive" })
      return
    }

    router.push(AppRoutes.dashboard)
  }

  const resendCode = async () => {
    await resendOTP()
    setTimeLeft(60)
    setIsResendDisabled(true)
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-bold'>Verify Your Email</CardTitle>
          <CardDescription className='text-center'>
            {`We've sent a verification code to your email address.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex justify-center'>
            <MailCheck className='h-12 w-12 text-blue-500' />
          </div>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Enter verification code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className='text-center text-lg transition-all duration-300 focus:ring-4 focus:ring-blue-300'
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button className='w-full' onClick={handleSubmit} isLoading={isVerifyingOTP}>
            Verify Email
          </Button>
          <p className='text-center text-sm text-gray-500'>
            {`Didn't receive the code? `}
            <Button variant='link' className='p-0' onClick={resendCode} disabled={isResendDisabled}>
              Resend code {timeLeft > 0 ? ` in ${timeLeft}` : ""}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
