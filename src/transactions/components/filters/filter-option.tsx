import { Checkbox } from "@/src/ui-lib/components/ui/checkbox"

interface CheckboxOptionProps {
  id: string
  defaultValue: boolean
  label: string
  rightText?: string
  onCheck: (checked: boolean) => void
}

export function FilterOption({ id, defaultValue, label, rightText, onCheck }: CheckboxOptionProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center gap-2 py-3'>
        <Checkbox id={id} checked={defaultValue} onCheckedChange={onCheck} />
        <label htmlFor={id} className='w-full cursor-pointer'>
          {label}
        </label>
      </div>
      {rightText && <div className='text-sm text-gray-400'>{rightText}</div>}
    </div>
  )
}
