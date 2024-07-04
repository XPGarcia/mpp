import { forwardRef } from "react"
import { FormLabel } from "../form-label/form-label"

const styles = {
  default: "border-shades-50 focus:border-blue-400 focus:ring-blue-300 focus:outline-blue-400",
  error: "border-red-400 focus:border-red-400 focus:ring-red-300 focus:outline-red-400",
}

const sizes = {
  sm: "text-sm h-[32px] rounded-md",
  md: "text-base h-[40px] rounded-md",
  lg: "text-base h-[46px] rounded-lg",
}

interface Props {
  id: string
  defaultValue?: string
  size?: "sm" | "md" | "lg"
  label?: string
  errorMessage?: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

const ErrorMessage = ({ message }: { message: string }) => {
  return <p className='mt-1 text-xs text-red-400'>{message}</p>
}

export const FormSelect = ({ id, defaultValue, size = "md", label, errorMessage, options, onChange }: Props) => {
  const hasError = errorMessage !== undefined
  const style = hasError ? styles.error : styles.default
  const sizeStyle = sizes[size]

  return (
    <div>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <select
        id={id}
        value={defaultValue}
        className={`block w-full border bg-white px-3 text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:ring focus:ring-opacity-40 sm:px-5 ${style} ${sizeStyle}`}
        onChange={(e) => onChange(e.target.value)}
      >
        <option></option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {hasError && <ErrorMessage message={errorMessage} />}
    </div>
  )
}
