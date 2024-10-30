import { useSession } from "next-auth/react";
import { useState } from "react";

const useDeleteTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const deleteTicket = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ticket/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return { deleteTicket, isLoading, error };
};

export default useDeleteTicket;
