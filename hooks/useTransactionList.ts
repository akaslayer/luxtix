import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface TransactionList {
  data: Transaction[];
  totalData: number;
}

export type Transaction = {
  transactionId: number;
  eventId: number;
  eventDate: string;
  eventName: string;
  eventImage: string;
  isDone: boolean;
  canReview: boolean;
};

const useTransactionList = () => {
  const [transactionList, setTransactionList] = useState<TransactionList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [transactionLimit, setTransactionLimit] = useState<number>(1);
  const { data: session } = useSession();
  const getLists = async () => {
    try {
      const headers: HeadersInit = {};
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const limit = 6 * transactionLimit;
      setLoading(true);
      const endpoint = `/api/transaction?size=${limit}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          credentials: "include",
          headers,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user transaction");
      }
      const transaction = await response.json();
      setTransactionList(transaction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLists();
  }, [transactionLimit]);
  return {
    transactionList,
    loading,
    error,
    transactionLimit,
    setTransactionLimit,
    getLists,
  };
};

export default useTransactionList;
