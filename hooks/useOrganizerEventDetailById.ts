import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

interface EventOrganizerDetailType {
  name: string
  category: number
  city: number
  isOnline: boolean
  eventDate: string
  venue: string
  address: string
  description: string
  isPaid: boolean
  startTime: string
  endTime: string
  tickets: {
    id: string
    name: string
    price: number
    qty: number
  }[]
  vouchers: {
    id: string
    name: string
    qty: number
    rate: number
    startDate: string
    endDate: string
    referralOnly: boolean
  }[]
}
const useOrganizerEventDetailById = (id: number) => {
  const [event, setEvent] = useState<EventOrganizerDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const endpoint = `/api/summary/event/${id}`

        const headers: HeadersInit = {}
        if (session) {
          headers['Authorization'] = `Bearer ${session.user.accessToken}`
        }
        const response = await fetch(
          `https://dti-backend-lg2iizcpdq-uc.a.run.app${endpoint}`,
          {
            credentials: 'include',
            headers,
          }
        )
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        const data = await response.json()
        setEvent(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, session])

  return { event, loading, error }
}

export default useOrganizerEventDetailById
