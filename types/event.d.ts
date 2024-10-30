export interface EventType {
  id: number
  address: string
  venueName: string
  eventImage: string
  descriptions: string
  ticketPrice: number
  priceCategory: string
  categoryName: string
  cityName: string
  isOnline: boolean
  favoriteCount: number
  isFavorite: boolean
  eventDate: string
  eventDay: string
  startTime: string
  endTime: string
  eventName: string
}

export interface EventDetailType {
  id: number
  eventName: string
  cityName: string
  address: string
  eventImage: string
  venueName: string
  description: string
  eventDate: string
  startTime: string
  endTime: string
  isOnline: boolean
  isDone: boolean
  priceCategory: string
  organizerName: string
  organizerAvatar: string
  favoriteCounts: number
  isFavorite: boolean
  tickets: {
    id: number
    name: string
    price: number
    qty: number
    remainingQty: number
  }[]
  vouchers: {
    voucherId: number
    voucherName: string
    voucherRate: number
  }[]
}
