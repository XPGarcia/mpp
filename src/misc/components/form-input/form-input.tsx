import { InputHTMLAttributes, forwardRef } from "react"
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

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg"
  label?: string
  errorMessage?: string
  helperText?: string
  leftElement?: React.ReactNode
}

const ErrorMessage = ({ message }: { message: string }) => {
  return <p className='mt-1 text-xs text-red-400'>{message}</p>
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ size = "md", label, errorMessage, helperText, type = "text", onChange, leftElement, ...props }, ref) => {
    const hasError = errorMessage !== undefined
    const style = hasError ? styles.error : styles.default
    const sizeStyle = sizes[size]

    return (
      <div>
        {label && <FormLabel>{label}</FormLabel>}
        <div className='relative box-border'>
          {leftElement && (
            <div className='absolute left-[2px] top-[2px] flex h-[36px] w-10 items-center justify-center rounded-l-md border-transparent bg-gray-50'>
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`block w-full border bg-white pr-3 ${leftElement ? "pl-12" : "pl-3"} text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:ring focus:ring-opacity-40 sm:pr-5 ${style} ${sizeStyle}`}
            {...props}
          />
        </div>
        {hasError && <ErrorMessage message={errorMessage} />}
        {helperText && <div className='mt-1 text-xxs text-neutral-500'>{helperText}</div>}
      </div>
    )
  }
)
