import { ButtonHTMLAttributes } from "react"
import { Icon } from "../icons/icon"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  scheme?: "primary" | "error"
  variant?: "solid" | "outline" | "ghost"
  isLoading?: boolean
}

const colorScheme = {
  primary: "shades-500",
  error: "red-500",
}

const getStyles = (scheme: "primary" | "error") => {
  const color = colorScheme[scheme]
  return {
    solid: {
      default: `bg-${color} px-6 text-white shadow-md shadow-${color}/20 transition-all hover:shadow-lg hover:shadow-${color}/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
      disabled: "",
    },
    outline: {
      default: `border border-${color} px-6 text-${color} transition-all hover:opacity-75 focus:ring focus:ring-primary-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
      disabled: "bg-shades-300",
    },
    ghost: {
      default: `px-6 text-${color} transition-all hover:bg-${color}/10 active:bg-${color}/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
      disabled: "",
    },
  }
}

const sizes = {
  sm: "text-sm h-[32px] rounded-md",
  md: "text-base h-[40px] rounded-md",
  lg: "text-base h-[46px] rounded-lg",
}

export const Button = ({
  variant = "solid",
  scheme = "primary",
  size = "md",
  children,
  className,
  isLoading = false,
  disabled,
  type,
  ...props
}: Props) => {
  const styles = getStyles(scheme)
  const defaultStyle = styles[variant].default
  const loadingStyle = disabled || isLoading ? styles[variant].disabled : ""
  const sizeStyle = sizes[size]

  return (
    <button
      type={type ?? "button"}
      className={`middle none center flex items-center justify-center font-sans font-medium ${sizeStyle} ${defaultStyle} ${loadingStyle} ${className ?? ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {!isLoading ? children : <Icon icon='loading' />}
    </button>
  )
}
