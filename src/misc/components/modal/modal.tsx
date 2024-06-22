import { ReactNode } from "react"
import { Backdrop } from "../backdrop/backdrop"
import { Icon } from "../icons/icon"

interface Props {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  isCentered?: boolean
}

export const Modal = ({ isOpen, onClose, title = "", isCentered, children }: Props) => {
  const styles = isOpen ? "flex" : "hidden"
  const ariaProperties = isOpen ? { "aria-hidden": false, "aria-modal": true, role: "dialog" } : { "aria-hidden": true }

  return (
    <>
      <Backdrop isActive={isOpen} onClick={onClose} />
      <div
        tabIndex={-1}
        className={`fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)] max-h-full w-screen justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0 ${isCentered ? "items-center" : ""} ${styles}`}
        {...ariaProperties}
      >
        <div className='relative max-h-full w-full max-w-lg'>
          <button
            type='button'
            className='absolute right-6 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-shades-100'
            onClick={onClose}
          >
            <Icon icon='x-mark' />
          </button>
          <div className='relative rounded-2xl bg-gray-100 p-8 shadow'>
            <p className='pb-2 text-lg font-medium'>{title}</p>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
