export const formatRecurrentDescription = (
  description: string | undefined,
  currentOccurrence: number,
  totalOccurrences: number
): string => {
  const base = description ?? ""
  const suffix = `(${currentOccurrence}/${totalOccurrences})`
  return base ? `${base} ${suffix}` : suffix
}
