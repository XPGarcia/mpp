import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingAddButton = (props: Props) => {
  return (
    <button
      className='fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-shades-500'
      {...props}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' className='size-6'>
        <path
          fillRule='evenodd'
          d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
          clipRule='evenodd'
        />
      </svg>
    </button>
  )
}
