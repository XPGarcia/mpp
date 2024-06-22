"use client"

import { usePathname, useRouter } from "next/navigation"
import { BookIcon } from "../icons/book-icon"
import { StatsIcon } from "../icons/stats-icon"
import { AccountsIcon } from "../icons/accounts-icon"
import { HorizontalDotsIcon } from "../icons/horizontal-dots-icon"
import { Icon } from "../icons/icon"

export const BottomNavigation = () => {
  const pathName = usePathname()
  const router = useRouter()

  const options = [
    {
      label: "Trans.",
      icon: <Icon icon='book' />,
      onClick: () => {
        router.push("/")
      },
    },
    {
      label: "Stats",
      icon: <Icon icon='stats' />,
      onClick: () => {
        router.push("/stats")
      },
    },
    {
      label: "Accounts",
      icon: <Icon icon='accounts' />,
      onClick: () => {
        router.push("/accounts")
      },
    },
    {
      label: "More",
      icon: <Icon icon='horizontal-dots' />,
      onClick: () => {
        router.push("/options")
      },
    },
  ]

  if (pathName.startsWith("/login") || pathName.startsWith("/sign-up")) return <></>

  return (
    <div className='fixed bottom-0 left-0 z-40 h-[58px] w-full bg-shades-500'>
      <div className={`mx-auto grid h-full max-w-slim grid-cols-4 font-light`}>
        {options.map((option) => (
          <button
            key={option.label}
            type='button'
            className='group inline-flex flex-col items-center justify-center pt-1 text-white hover:bg-shades-300'
            onClick={option.onClick}
          >
            {option.icon}
            <span className='mt-0.5 text-xs'>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
