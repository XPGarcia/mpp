import { ButtonHTMLAttributes } from "react"
import { LoadingIcon } from "../icons/loading-icon"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "solid" | "outline" | "ghost"
  isLoading?: boolean
}

const styles = {
  solid: {
    default:
      "bg-shades-500 px-6 text-white shadow-md shadow-shades-500/20 transition-all hover:shadow-lg hover:shadow-shades-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "",
  },
  outline: {
    default:
      "border border-shades-500 px-6 text-shades-500 transition-all hover:opacity-75 focus:ring focus:ring-primary-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "bg-shades-300",
  },
  ghost: {
    default:
      "px-6 text-shades-500 transition-all hover:bg-shades-500/10 active:bg-shades-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    disabled: "",
  },
}

const sizes = {
  sm: "text-sm h-[32px] rounded-md",
  md: "text-base h-[40px] rounded-md",
  lg: "text-base h-[46px] rounded-lg",
}

export const Button = ({
  variant = "solid",
  size = "md",
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: Props) => {
  const defaultStyle = styles[variant].default
  const loadingStyle = disabled || isLoading ? styles[variant].disabled : ""
  const sizeStyle = sizes[size]

  return (
    <button
      className={`middle none center font-sans font-medium ${sizeStyle} ${defaultStyle} ${loadingStyle} $ ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {!isLoading ? children : <LoadingIcon />}
    </button>
  )
}
