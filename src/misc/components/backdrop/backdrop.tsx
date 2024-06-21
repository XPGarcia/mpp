interface Props {
  isActive: boolean
  onClick: () => void
}

export const Backdrop = ({ isActive, onClick }: Props) => {
  return (
    <div className={`${isActive ? "block" : "hidden"} fixed inset-0 z-30 bg-shades-400 opacity-50`} onClick={onClick} />
  )
}
