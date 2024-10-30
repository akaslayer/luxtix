import { useState, useEffect } from "react";
import { EventType } from "@/types/event";
import { useSession } from "next-auth/react";

interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: EventType[];
  totalPages: number;
  currentPage: number;
}
export function useEvents(
  queryParams: string = "",
  size: number = 10,
  page: number = 0
) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const endpoint = session
          ? `/api/events${
              queryParams
                ? `?${queryParams}&size=${size}&page=${page}`
                : `?size=${size}&page=${page}`
            }`
          : `/api/events/public${
              queryParams ? `?${queryParams}&` : "?"
            }size=${size}&page=${page}`;

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
        const data: ApiResponse = await response.json();
        setEvents((prevEvents) =>
          page === 0 ? data.data : [...prevEvents, ...data.data]
        );
        setHasMore(data.currentPage < data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [queryParams, size, page, session]);

  return { events, loading, error, hasMore };
}
