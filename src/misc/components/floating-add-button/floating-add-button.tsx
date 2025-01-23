import { ButtonHTMLAttributes } from "react"
import { Button } from "@/src/ui-lib/components/ui/button"
import { Plus } from "lucide-react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingAddButton = (props: Props) => {
  return (
    <Button
      variant='default'
      size='icon'
      className='fixed bottom-16 right-6 h-12 w-12 rounded-full [&_svg]:size-6'
      {...props}
    >
      <Plus />
    </Button>
  )
}
