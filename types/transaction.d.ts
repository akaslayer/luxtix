interface Ticket {
  id: number
  ticketName: string
  ticketQty: number
}
export interface TransactionDetail {
  eventName: string
  eventImage: string
  eventDate: string
  startTime: string
  endTime: string
  venueName: string
  cityName: string
  isOnline: boolean
  tickets: Ticket[]
}
