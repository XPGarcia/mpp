import { useState } from "react"

export const useBoolean = (defaultValue: boolean) => {
  const [value, setValue] = useState(defaultValue)

  const on = () => setValue(true)
  const off = () => setValue(false)
  const toggle = () => setValue((prev) => !prev)

  return { value, on, off, toggle }
}
