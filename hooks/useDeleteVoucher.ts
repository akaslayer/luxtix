import { useSession } from "next-auth/react";
import { useState } from "react";

const useDeleteVoucher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const deleteVoucher = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/voucher/${id}`,
        {
          credentials: "include",
          method: "DELETE",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete voucher");
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return { deleteVoucher, isLoading, error };
};

export default useDeleteVoucher;
