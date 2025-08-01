export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const day = date.getDate().toString().padStart(2, "0")
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const isEventUpcoming = (startDate) => {
  return new Date(startDate) > new Date()
}

export const isEventOngoing = (startDate, endDate) => {
  const now = new Date()
  return new Date(startDate) <= now && new Date(endDate) >= now
}

export const isEventCompleted = (endDate) => {
  return new Date(endDate) < new Date()
}
