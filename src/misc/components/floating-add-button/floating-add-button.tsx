import { ButtonHTMLAttributes } from "react"
import { Icon } from "../icons/icon"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingAddButton = (props: Props) => {
  return (
    <button
      className='fixed bottom-16 right-6 flex size-12 items-center justify-center rounded-full bg-shades-500'
      {...props}
    >
      <span className='text-white'>
        <Icon icon='plus' size='lg' />
      </span>
    </button>
  )
}
