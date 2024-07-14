interface Props {
  percentage: number
  color?: "black" | "red" | "yellow" | "blue"
  leftLabel?: string
  rightLabel?: string
  withPercentageLabel?: boolean
  flipX?: boolean
  transparentBg?: boolean
}

export const Progress = ({
  percentage,
  color = "black",
  leftLabel,
  rightLabel,
  withPercentageLabel = false,
  flipX = false,
  transparentBg = false,
}: Props) => {
  const colors = {
    black: "bg-shades-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  }
  const colorScheme = colors[color]

  const mb = withPercentageLabel ? "mb-6" : "mb-0"
  const rotate = flipX ? "rotate-180" : "rotate-0"
  const bg = transparentBg ? "bg-transparent" : "bg-gray-200"

  return (
    <div>
      {(leftLabel || rightLabel) && (
        <div className='mb-1 flex justify-between'>
          {leftLabel && <p>{leftLabel}</p>}
          {rightLabel && <p className='self-end'>{rightLabel}</p>}
        </div>
      )}
      <div className={`relative h-2.5 w-full rounded-full ${bg} ${mb} ${rotate}`}>
        <div
          className={`h-2.5 rounded-full ${colorScheme}`}
          style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
        />
        {withPercentageLabel && (
          <p
            className='absolute mt-1 self-end text-xs font-medium'
            style={{ left: `${percentage >= 100 ? 92 : percentage <= 4 ? 0 : percentage - 4}%` }}
          >
            {`${percentage}%`}
          </p>
        )}
      </div>
    </div>
  )
}
