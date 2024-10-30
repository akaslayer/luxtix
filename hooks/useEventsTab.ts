import { useState, useEffect } from "react";
import { EventType } from "@/types/event";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: EventType[];
  totalPages: number;
  currentPage: number;
}

export function useEventsTab(queryParams: string = "") {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const search = useSearchParams();
  const city = search.get("city") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint = session
          ? `/api/events${queryParams ? `?${queryParams}` : ""}`
          : `/api/events/public${queryParams ? `?${queryParams}` : ""}`;

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
        setEvents(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [queryParams, session]);

  return { events, loading, error };
}
