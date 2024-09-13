"use client"
import { notFound } from "next/navigation"

export default function VerifyEmail() {
  const params = new URLSearchParams(document.location.search)
  const token = params.get("token")

  const copies = {
    hasToken: {
      title: "Welcome Aboard!",
      description:
        "Hey, thanks for signing up! We're thrilled to have you. Your email is now verified and you're all set to explore!",
      ctaLabel: "Go to Dashboard",
    },
    noToken: {
      title: "Almost There!",
      description:
        "Thanks for signing up! To complete the registration process, please check your email and verify your address.",
      ctaLabel: "Go to Login",
    },
  }

  const hasToken = !!token

  const copy = hasToken ? copies.hasToken : copies.noToken

  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <div className='max-w-lg transform rounded-3xl bg-white p-8 text-center shadow-none transition duration-500 md:bg-gray-100 md:shadow-xl'>
        <div className='mb-6 flex justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-20 w-20 text-green-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeDasharray='60,40' />
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4' />
          </svg>
        </div>
        <h1 className='mb-2 text-4xl font-extrabold text-gray-900'>{copy.title}</h1>
        <p className='mb-6 text-lg text-gray-600'>{copy.description}</p>
        {hasToken && (
          <button className='transform rounded-full bg-gradient-to-r from-gray-700 to-black px-6 py-3 text-white shadow-lg transition hover:from-gray-600 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500'>
            {copy.ctaLabel}
          </button>
        )}
        {!hasToken && (
          <div className='mt-8'>
            <p className='text-sm text-gray-500'>
              {`Didn't receive the email?`}{" "}
              <a href='#' className='text-gray-700 hover:underline'>
                Resend verification email
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
