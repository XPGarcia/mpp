import dayjs from "dayjs"
import { ChangeEvent, useState } from "react"

export type MonthPickerDate = {
  month: string
  year: string
}

interface Props {
  defaultValue?: string
  onChange: (range: MonthPickerDate) => void
}

export const MonthPicker = ({ defaultValue, onChange }: Props) => {
  const [yearMonth, setYearMonth] = useState<string>(defaultValue ?? dayjs(new Date()).format("YYYY-MM"))

  const handleChangeMonth = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === yearMonth) {
      return
    }
    setYearMonth(value)
    onChange({
      month: value.split("-")[1],
      year: value.split("-")[0],
    })
  }

  return (
    <input
      type='month'
      value={yearMonth}
      max={dayjs(new Date()).format("YYYY-MM")}
      className='block h-[30px] w-fit rounded-md border border-shades-50 bg-white px-2 text-xs text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:border-blue-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:outline-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:px-5'
      onChange={handleChangeMonth}
    />
  )
}
