import { LabelHTMLAttributes } from "react"

export const FormLabel = ({ children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className='mb-2 block text-sm text-neutral-600' {...props}>
      {children}
    </label>
  )
}
