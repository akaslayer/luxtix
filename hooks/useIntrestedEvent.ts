import { useState } from "react";
import { useSession } from "next-auth/react";

export const useIntrestedEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const toogleIntrested = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorite/toggle/${id}`,
        {
          credentials: "include",
          method: "POST",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return { toogleIntrested, isLoading, error };
};
