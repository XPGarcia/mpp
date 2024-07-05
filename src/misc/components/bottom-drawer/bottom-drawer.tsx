import { ReactNode } from "react"
import { Backdrop } from "../backdrop/backdrop"
import { Icon } from "../icons/icon"

interface Props {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const BottomDrawer = ({ isOpen, onClose, title, children }: Props) => {
  const styles = isOpen ? "transform-none" : "translate-y-full"
  const ariaProperties = isOpen ? { "aria-hidden": false, "aria-modal": true, role: "dialog" } : { "aria-hidden": true }

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 w-full overflow-y-auto rounded-t-3xl bg-gray-100 px-4 pb-10 pt-4 transition-transform ${styles}`}
        tabIndex={-1}
        {...ariaProperties}
      >
        <button
          type='button'
          className='absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-shades-100'
          onClick={onClose}
        >
          <Icon icon='x-mark' />
        </button>

        <div>
          <p className={`pb-2 text-lg font-medium ${title ? "mt-0" : "mt-4"}`}>{title}</p>
          {children}
        </div>
      </div>
      <Backdrop isActive={isOpen} onClick={onClose} />
    </>
  )
}
