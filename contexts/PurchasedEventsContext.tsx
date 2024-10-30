"use client";

import { EventType } from "@/types/event";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PurchasedEventsContextType {
  purchasedEvents: Map<number, EventType>;
  addPurchasedEvent: (event: EventType) => void;
  eventId: number | null;
  setEventId: (id: number) => void;
}

const PurchasedEventsContext = createContext<
  PurchasedEventsContextType | undefined
>(undefined);

export const PurchasedEventsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [purchasedEvents, setPurchasedEvents] = useState<
    Map<number, EventType>
  >(new Map());
  const [eventId, setEventId] = useState<number | null>(null);

  const addPurchasedEvent = (event: EventType) => {
    setPurchasedEvents(new Map(purchasedEvents.set(event.id, event)));
  };

  return (
    <PurchasedEventsContext.Provider
      value={{ purchasedEvents, addPurchasedEvent, eventId, setEventId }}
    >
      {children}
    </PurchasedEventsContext.Provider>
  );
};

export const usePurchasedEvents = () => {
  const context = useContext(PurchasedEventsContext);
  if (context === undefined) {
    throw new Error(
      "usePurchasedEvents must be used within a PurchasedEventsProvider"
    );
  }
  return context;
};
