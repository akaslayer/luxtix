import { useSession } from "next-auth/react";
import { useState } from "react";

export interface EventSummary {
  id: string;
  name: string;
  venue: string;
  address: string;
  city: string;
  eventDate: string;
  eventDay: string;
  startTime: string;
  endTime: string;
  ticketQty: number;
  soldTicket: number;
  revenue: number;
  rating: number;
  tickets: { date: string; totalQty: number }[];
}

const useEventSummary = () => {
  const [eventSummary, setEventSummary] = useState<EventSummary>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchEventSummary = async (id: number, dateType: string) => {
    try {
      const endpoint = `/api/summary/${id}?dateType=${dateType}`;

      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          credentials: "include",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { fetchEventSummary };
};

export default useEventSummary;
