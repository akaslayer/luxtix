import { useSession } from "next-auth/react";
import { useState } from "react";

const useTransactionDetail = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const { data: session } = useSession();

  const getDetailTransaction = async (transactionId: number | undefined) => {
    try {
      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      setLoading(true);
      const endpoint = `/api/transaction/detail/${transactionId}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          credentials: "include",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user transaction detail");
      }
      const transactionDetail = await response.json();
      return transactionDetail.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return {
    getDetailTransaction,
    loading,
    error,
  };
};

export default useTransactionDetail;
