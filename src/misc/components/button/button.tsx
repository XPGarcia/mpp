import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost"
}

const styles = {
  solid:
    "bg-shades-500 px-6 py-3 text-white shadow-md shadow-shades-500/20 transition-all hover:shadow-lg hover:shadow-shades-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  outline:
    "border border-shades-500 px-6 py-3 text-shades-500 transition-all hover:opacity-75 focus:ring focus:ring-primary-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
  ghost:
    "px-6 py-3 text-shades-500 transition-all hover:bg-shades-500/10 active:bg-shades-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
}

export const Button = ({
  variant = "solid",
  children,
  className,
  ...props
}: Props) => {
  const style = styles[variant]

  return (
    <button
      className={`middle none center rounded-lg font-sans text-base font-medium ${style} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
