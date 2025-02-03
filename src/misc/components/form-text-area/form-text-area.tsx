import { forwardRef, TextareaHTMLAttributes } from "react"

import { FormLabel } from "@/src/ui-lib/components/ui/form"

const styles = {
  default: "border-shades-50 focus:border-blue-400 focus:ring-blue-300 focus:outline-blue-400",
  error: "border-red-400 focus:border-red-400 focus:ring-red-300 focus:outline-red-400",
}

const sizes = {
  sm: "text-sm h-[80x] rounded-md",
  md: "text-base h-[120px] rounded-md",
  lg: "text-base h-[140px] rounded-lg",
}

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: "sm" | "md" | "lg"
  label?: string
  errorMessage?: string
  helperText?: string
}

const ErrorMessage = ({ message }: { message: string }) => {
  return <p className='mt-1 text-xs text-red-400'>{message}</p>
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ size = "md", label, errorMessage, helperText, ...props }, ref) => {
    const hasError = errorMessage !== undefined
    const style = hasError ? styles.error : styles.default
    const sizeStyle = sizes[size]

    return (
      <div>
        {label && <FormLabel>{label}</FormLabel>}
        <div className='relative box-border'>
          <textarea
            ref={ref}
            className={`block w-full border bg-white px-3 py-2 text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:ring focus:ring-opacity-40 sm:pr-5 ${style} ${sizeStyle}`}
            {...props}
          />
        </div>
        {hasError && <ErrorMessage message={errorMessage} />}
        {helperText && <div className='mt-1 text-xxs text-neutral-500'>{helperText}</div>}
      </div>
    )
  }
)
