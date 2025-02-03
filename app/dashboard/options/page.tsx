"use client"

import { Layers, MailOpen, Tag, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { MouseEvent } from "react"

import { AppRoutes } from "@/src/utils/routes"

export default function Options() {
  const router = useRouter()

  const logout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await signOut()
  }

  const options = [
    {
      label: "Accounts",
      icon: <Layers />,
      onClick: () => {
        router.push(AppRoutes.accounts)
      },
    },
    {
      label: "Categories",
      icon: <Tag />,
      onClick: () => {
        router.push(AppRoutes.categories)
      },
    },
    {
      label: "Feedback",
      icon: <MailOpen />,
      onClick: () => {
        router.push(AppRoutes.feedback)
      },
    },
    {
      label: "Logout",
      icon: <TriangleAlert />,
      onClick: logout,
    },
  ]

  return (
    <main className='flex w-full justify-center'>
      <div className='grid w-full max-w-slim grid-cols-3 p-5 sm:p-10'>
        {options.map((option) => (
          <button
            key={option.label}
            type='button'
            className='group inline-flex flex-col items-center justify-center py-4 text-sm font-medium text-shades-500 hover:bg-gray-100'
            onClick={option.onClick}
          >
            {option.icon}
            <span className='mt-1'>{option.label}</span>
          </button>
        ))}
      </div>
    </main>
  )
}
