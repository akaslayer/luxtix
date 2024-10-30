import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface userPointProps {
  points: number;
}
const useTotalUserPoint = () => {
  const [userPoint, setUserPoint] = useState<userPointProps | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserPoint = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (session) {
          headers["Authorization"] = `Bearer ${session.user.accessToken}`;
        }
        const endpoint = `/api/points`;

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
        const point = await response.json();
        setUserPoint(point.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPoint();
  }, []);

  return { userPoint, loading, error };
};

export default useTotalUserPoint;
