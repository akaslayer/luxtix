import React, { useState } from 'react'
import { z } from 'zod';

interface TicketTierProps {
  id: number;
  name: string;
  price: number;
  qty: number;
  remainingQty: number;
  onTicketCountChange: (ticketCount: number, price: number, previousCount: number) => void;
  index: number
  addTicketRow: (id: number, qty: number, price: number) => void;
  removeTicketRow: (id: number) => void
}


const ticketSchema = z.object({
  ticketId: z.number(),
  price: z.number(),
  qty: z.number().min(1),
});

const TicketTiers: React.FC<TicketTierProps> = ({ id, name, price, qty, remainingQty, onTicketCountChange, index, addTicketRow, removeTicketRow }) => {
  const [ticketCount, setTicketCount] = useState<number>(0);

  const handleIncreaseTickets = () => {
    if (ticketCount < remainingQty) {
      addTicketRow(id, ticketCount + 1, price)
      setTicketCount(ticketCount + 1);
      onTicketCountChange(ticketCount + 1, price, ticketCount);

    }
  };

  const handleDecreaseTickets = () => {
    if (ticketCount - 1 == 0) {
      removeTicketRow(id)
    }
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
      onTicketCountChange(ticketCount - 1, price, ticketCount);
    }
  };
  return (
    <div className="flex items-center justify-between border border-luxtix-5 rounded-lg p-4">
      <div className="flex flex-col">
        <span className="text-luxtix-1">{name}</span>
        <span className="text-sm">{`IDR ${price?.toLocaleString('de-DE', { minimumFractionDigits: 0 })}`}</span>
        <span className="text-xs text-luxtix-7">{`${remainingQty} Remaining`}</span>
      </div>
      <div className="flex items-center">
        <button
          className="px-2 py-1 border rounded-lg"
          onClick={handleDecreaseTickets}
        >
          -
        </button>
        <span className="mx-2">{ticketCount}</span>
        <button
          className="px-2 py-1 border rounded-lg"
          onClick={handleIncreaseTickets}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TicketTiers