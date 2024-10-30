import { useSession } from "next-auth/react";
import { useState } from "react";

const useEventReview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchEventReview = async (id: number | null, page: number) => {
    if (id != null) {
      try {
        const endpoint = `/api/event-review/${id}`;
        const headers: HeadersInit = {};
        if (session) {
          headers["Authorization"] = `Bearer ${session.user.accessToken}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}?page=${page}`,
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
    }
  };
  return { fetchEventReview };
};

export default useEventReview;
