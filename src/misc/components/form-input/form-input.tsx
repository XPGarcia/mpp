import { InputHTMLAttributes, forwardRef } from "react"

const styles = {
  default:
    "border-shades-50 focus:border-blue-400 focus:ring-blue-300 focus:outline-blue-400",
  error:
    "border-red-400 focus:border-red-400 focus:ring-red-300 focus:outline-red-400",
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  errorMessage?: string
  helperText?: string
}

const ErrorMessage = ({ message }: { message: string }) => {
  return <p className='mt-3 text-xs text-red-400'>{message}</p>
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, errorMessage, helperText, type = "text", ...props }, ref) => {
    const hasError = errorMessage !== undefined
    const style = hasError ? styles.error : styles.default

    return (
      <div>
        {label && (
          <label className='block text-sm text-neutral-600'>{label}</label>
        )}
        <input
          ref={ref}
          type={type}
          className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2.5 text-gray-700 placeholder-gray-400/70 hover:border-shades-400 focus:outline-none focus:outline-1 focus:-outline-offset-2 focus:ring focus:ring-opacity-40 sm:px-5 ${style}`}
          {...props}
        />
        {hasError && <ErrorMessage message={errorMessage} />}
        {helperText && (
          <div className='mt-1 text-xxs text-neutral-500'>{helperText}</div>
        )}
      </div>
    )
  }
)
