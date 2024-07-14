export interface IconProps {
  icon: Icon
  size?: "sm" | "md" | "lg"
}

export interface InternalIconProps {
  className?: string
}

export const Icons = {
  accounts: "accounts",
  book: "book",
  danger: "danger",
  "horizontal-dots": "horizontal-dots",
  loading: "loading",
  plus: "plus",
  stats: "stats",
  "x-mark": "x-mark",
  "envelope-open": "envelope-open",
  newspaper: "newspaper",
  "bank-notes": "bank-notes",
  check: "check",
  sparkles: "sparkles",
  pencil: "pencil",
  tag: "tag",
  trash: "trash",
  "chevron-down": "chevron-down",
} as const
export type Icon = (typeof Icons)[keyof typeof Icons]
