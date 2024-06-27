import { LoginForm } from "@/src/users/components/login-form"

export default function Login() {
  return (
    <main className='flex min-h-screen w-full items-center justify-center'>
      <div className='w-full max-w-slim px-4 sm:px-0'>
        <LoginForm />
      </div>
    </main>
  )
}
