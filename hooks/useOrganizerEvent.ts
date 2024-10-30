import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface OrganizerEvent {
  id: number;
  eventName: string;
}
const useOrganizerEvent = () => {
  const [organizerEvent, setOrganizerEvent] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const endpoint = "/api/summary/event";

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
        setOrganizerEvent(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, []);

  return { organizerEvent, loading, error };
};

export default useOrganizerEvent;
