import { useState, useEffect } from "react";
import { EventDetailType } from "@/types/event";
import { useSession } from "next-auth/react";

interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: EventDetailType;
}

export function useEventById(eventId: number) {
  const [event, setEvent] = useState<EventDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const endpoint = session
          ? `/api/events/${eventId}`
          : `/api/events/public/${eventId}`;

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
          throw new Error("Failed to fetch event");
        }
        const data: ApiResponse = await response.json();
        setEvent(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, session]);

  return { event, loading, error };
}
