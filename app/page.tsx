"use client"

import { Button } from "@/src/misc"
import { FloatingAddButton } from "@/src/misc/components/floating-add-button/floating-add-button"
import { AppRoutes } from "@/src/utils/routes"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MouseEvent } from "react"

export default function Home() {
  const router = useRouter()

  const logout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await signOut()
  }

  const addTransaction = () => {
    router.push(AppRoutes.addTransaction)
  }

  return (
    <main className='flex w-full justify-center p-4'>
      <Button onClick={logout}>Logout</Button>
      <FloatingAddButton onClick={addTransaction} />
    </main>
  )
}
