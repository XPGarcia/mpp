import { SignUpForm } from "@/src/auth/components/sign-up-form"

export default function SignUp() {
  return (
    <main className='flex min-h-screen w-full items-center justify-center'>
      <div className='w-full max-w-slim px-4 sm:px-0'>
        <SignUpForm />
      </div>
    </main>
  )
}
