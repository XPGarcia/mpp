"use client"

import { useRouter } from "next/navigation"
import { AppRoutes } from "@/src/utils/routes"
import { BookOpen, ChartNoAxesColumnIncreasing, Layers, Ellipsis } from "lucide-react"

const ICON_SIZE = 20

export const BottomNavigation = () => {
  const router = useRouter()

  const options = [
    {
      label: "Trans.",
      icon: <BookOpen size={ICON_SIZE} />,
      onClick: () => {
        router.push(AppRoutes.dashboard)
      },
    },
    {
      label: "Stats",
      icon: <ChartNoAxesColumnIncreasing size={ICON_SIZE} />,
      onClick: () => {
        router.push(AppRoutes.stats)
      },
    },
    {
      label: "Accounts",
      icon: <Layers size={ICON_SIZE} />,
      onClick: () => {
        router.push(AppRoutes.accounts)
      },
    },
    {
      label: "More",
      icon: <Ellipsis size={ICON_SIZE} />,
      onClick: () => {
        router.push(AppRoutes.options)
      },
    },
  ]

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
