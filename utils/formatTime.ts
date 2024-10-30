export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  return `${hours}.${minutes}`
}
