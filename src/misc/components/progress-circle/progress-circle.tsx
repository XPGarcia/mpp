import { cn } from "@/src/ui-lib/lib/utils"

type Size = "sm" | "md" | "lg"
type SizeAttributes = { width: number; fontSize: string; strokeWidth: number; className: string }

interface ProgressCircleProps {
  label: string
  percentage: number
  amount: string
  color: {
    base: string
    accent: string
  }
  size?: Size
}

const sizeConfig: Record<Size, SizeAttributes> = {
  sm: { width: 64, fontSize: "text-xs", strokeWidth: 6, className: "h-[64px] w-[64px]" },
  md: { width: 96, fontSize: "text-sm", strokeWidth: 8, className: "h-[96px] w-[96px]" },
  lg: { width: 128, fontSize: "text-lg", strokeWidth: 10, className: "h-[128px] w-[128px]" },
}

export function ProgressCircle({ label, percentage, amount, color, size = "md" }: ProgressCircleProps) {
  const { width, fontSize, strokeWidth } = sizeConfig[size]
  const radius = width / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className='flex flex-col items-center'>
      <div className={cn("mb-2 font-semibold", fontSize)}>{label}</div>
      <div className={cn("relative", sizeConfig[size].className)}>
        <svg className={cn("-rotate-90 transform", sizeConfig[size].className)}>
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='transparent'
            className={color.base}
          />
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap='round'
            className={cn("transition-all duration-1000 ease-in-out", color.accent)}
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center", fontSize)}>{percentage}%</div>
      </div>
      <div className={cn("mt-2", fontSize)}>{amount}</div>
    </div>
  )
}
