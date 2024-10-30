'use client'
import useTransactionList from '@/hooks/useTransactionList';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface TransactionList {
  data: Transaction[];
  totalData: number;
}

type Transaction = {
  transactionId: number;
  eventId: number;
  eventDate: string;
  eventName: string;
  eventImage: string;
  isDone: boolean;
  canReview: boolean
}

interface TransactionTicketContextType {
  userTransactionList: TransactionList;
  getLists: () => void;
  error: unknown;
  loading: boolean;
  transactionLimit: number;
  setTransactionLimit: (query: number) => void;
}

const defaultTransactionList: TransactionList = {
  data: [],
  totalData: 0
};

export const TransactionContext = createContext<TransactionTicketContextType>({
  userTransactionList: defaultTransactionList,
  getLists: () => { },
  error: null,
  loading: false,
  transactionLimit: 1,
  setTransactionLimit: (query: number) => { }
});

const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { transactionList, error, loading, transactionLimit, setTransactionLimit, getLists } = useTransactionList();
  const [userTransactionList, setUserTransactionList] = useState<TransactionList>(defaultTransactionList);

  useEffect(() => {
    setUserTransactionList(transactionList || defaultTransactionList);
  }, [transactionList]);


  return (
    <TransactionContext.Provider value={{ userTransactionList, error, loading, transactionLimit, setTransactionLimit, getLists }}>
      {children}
    </TransactionContext.Provider>
  )
}

export default TicketProvider;

export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext);
  return ctx;
}