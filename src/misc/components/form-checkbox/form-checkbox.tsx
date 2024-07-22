import { useBoolean } from "../../hooks/use-boolean"

interface Props {
  id: string
  label: string
  isChecked?: boolean
  isDisabled?: boolean
  onChange: (isChecked: boolean) => void
}

export const FormCheckbox = ({ id, label, isChecked = false, isDisabled = false, onChange }: Props) => {
  const { value, on, off } = useBoolean(isChecked)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    if (newValue) {
      on()
    } else {
      off()
    }
    onChange(newValue)
  }

  return (
    <div className='my-1 flex items-center'>
      <input
        id={id}
        type='checkbox'
        checked={value}
        className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-400 focus:ring-2 focus:ring-blue-300'
        disabled={isDisabled}
        onChange={handleChange}
      />
      <label htmlFor={id} className='ms-2 text-sm font-medium text-shades-500'>
        {label}
      </label>
    </div>
  )
}
