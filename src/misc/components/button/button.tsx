import { ButtonHTMLAttributes } from "react"
import { LoadingIcon } from "../icons/loading-icon"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost"
  isLoading?: boolean
}

const styles = {
  solid: {
    default:
      "bg-shades-500 px-6 py-2.5 text-white shadow-md shadow-shades-500/20 transition-all hover:shadow-lg hover:shadow-shades-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "",
  },
  outline: {
    default:
      "border border-shades-500 px-6 py-3 text-shades-500 transition-all hover:opacity-75 focus:ring focus:ring-primary-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "bg-shades-300",
  },
  ghost: {
    default:
      "px-6 py-3 text-shades-500 transition-all hover:bg-shades-500/10 active:bg-shades-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "",
  },
}

export const Button = ({ variant = "solid", children, className, isLoading = false, disabled, ...props }: Props) => {
  const defaultStyle = styles[variant].default
  const loadingStyle = disabled || isLoading ? styles[variant].disabled : ""

  return (
    <button
      className={`middle none center rounded-lg font-sans text-base font-medium ${defaultStyle} ${loadingStyle} $ ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {!isLoading ? children : <LoadingIcon />}
    </button>
  )
}
