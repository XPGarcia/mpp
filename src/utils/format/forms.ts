export const initialValueForFormDate = (date: Date): Date => {
  return date.toJSON().slice(0, 10) as unknown as Date
}
