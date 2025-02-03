import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cn } from "@/src/ui-lib/lib/utils"

interface CustomProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string
  withBackground?: boolean
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, CustomProgressProps>(
  ({ className, value, indicatorColor = "bg-primary", withBackground = true, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        `relative h-2 w-full overflow-hidden rounded-full ${withBackground ? "bg-primary/20" : "bg-none"}`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${indicatorColor} rounded-full transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
