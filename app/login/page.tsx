import { LoginForm } from "@/src/auth/components/login-form"

export default function Login() {
  return (
    <main className='flex min-h-screen w-full items-center justify-center'>
      <div className='w-full max-w-slim px-4 sm:px-0'>
        <h1 className='text-center text-2xl text-[#121212]'>Welcome</h1>
        <LoginForm />
      </div>
    </main>
  )
}
