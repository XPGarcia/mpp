import { AccountsIcon } from "./accounts-icon"
import { BookIcon } from "./book-icon"
import { DangerIcon } from "./danger-icon"
import { HorizontalDotsIcon } from "./horizontal-dots-icon"
import { Icon as IconType } from "./types"
import { LoadingIcon } from "./loading-icon"
import { PlusIcon } from "./plus-icon"
import { StatsIcon } from "./stats-icon"
import { IconProps, InternalIconProps } from "./types"
import { XMarkIcon } from "./x-mark-icon"
import { EnvelopeOpenIcon } from "./envelope-open"
import { NewspaperIcon } from "./newspaper-icon"
import { BankNotesIcon } from "./bank-notes-icon"
import { CheckIcon } from "./check-icon"
import { SparklesIcon } from "./sparkles-icon"
import { PencilIcon } from "./pencil-icon"
import { TagIcon } from "./tag-icon"
import { TrashIcon } from "./trash-icon"

const styles = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

const IconBuilder = (icon: IconType, internalProps: InternalIconProps) => {
  const icons: Record<IconType, JSX.Element> = {
    accounts: <AccountsIcon {...internalProps} />,
    book: <BookIcon {...internalProps} />,
    danger: <DangerIcon {...internalProps} />,
    "horizontal-dots": <HorizontalDotsIcon {...internalProps} />,
    loading: <LoadingIcon {...internalProps} />,
    plus: <PlusIcon {...internalProps} />,
    stats: <StatsIcon {...internalProps} />,
    "x-mark": <XMarkIcon {...internalProps} />,
    "envelope-open": <EnvelopeOpenIcon {...internalProps} />,
    newspaper: <NewspaperIcon {...internalProps} />,
    "bank-notes": <BankNotesIcon {...internalProps} />,
    check: <CheckIcon {...internalProps} />,
    sparkles: <SparklesIcon {...internalProps} />,
    pencil: <PencilIcon {...internalProps} />,
    tag: <TagIcon {...internalProps} />,
    trash: <TrashIcon {...internalProps} />,
  }
  return icons[icon]
}

export const Icon = ({ icon, size = "md" }: IconProps) => {
  const style = styles[size]
  return IconBuilder(icon, { className: style })
}
