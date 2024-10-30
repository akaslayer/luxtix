"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useEventById } from "@/hooks/useEventById";
import { format } from "date-fns";
import TicketTiers from "./_components/TicketTiers";
import useTotalUserPoint from "@/hooks/useTotalUserPoint";
import { z } from "zod";
import { useEffect, useState } from "react";
import useCalculateTransaction from "@/hooks/useCalculateTransaction";
import { toast } from "@/components/ui/use-toast";
import useCheckoutTransaction from "@/hooks/useCheckoutTransaction";
import CircularLoader from "@/components/ui/circular-loader";

const voucherSchema = z.object({
  voucherId: z.number().nullable(),
  originalPrice: z.number(),
  usePoint: z.number().nullable(),
});

interface TicketRow {
  ticketId: number;
  price: number;
  qty: number;
}

const createTransactionSchema = z.object({
  eventId: z.string(),
  voucherId: z.number().nullable(),
  totalQty: z.number().min(1, "Ticket qty is required"),
  finalPrice: z.number(),
  totalDiscount: z.number(),
  originalPrice: z.number(),
  usePoint: z.number().nullable(),
  tickets: z.array(
    z.object({
      ticketId: z.number(),
      price: z.number(),
      qty: z.number(),
    })
  ),
});

function Transaction() {
  const { id } = useParams();
  const router = useRouter();
  const { event, loading, error } = useEventById(Number(id));
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQty, setTotalQty] = useState<number>(0);
  const { calculateTransaction } = useCalculateTransaction();
  const { checkoutTransaction } = useCheckoutTransaction();
  const { userPoint } = useTotalUserPoint();
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");
  const [userPointUsed, setUserPointUsed] = useState<boolean>(false);
  const [voucherIdValue, setVoucherIdValue] = useState<number | null>(null);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [ticketRows, setTicketRows] = useState<TicketRow[]>([]);

  useEffect(() => {
    if (totalPrice == 0) {
      setUserPointUsed(false);
    }
    const handleApplyClick = async () => {
      const data = {
        voucherId: voucherIdValue === null ? null : voucherIdValue,
        originalPrice: totalPrice,
        usePoint: userPointUsed ? userPoint?.points : 0,
      };
      try {
        const result = voucherSchema.parse(data);
        const resultData = await calculateTransaction(result);
        if (
          resultData.finalPrice !== undefined ||
          resultData.totalDiscount !== undefined
        ) {
          setFinalPrice(resultData.finalPrice);
          setTotalDiscount(resultData.totalDiscount);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error:", error.errors);
        } else {
          console.error("API error:", error);
        }
      }
    };

    handleApplyClick();
  }, [totalPrice, userPointUsed, selectedVoucher]);

  const handleTicketCountChange = (
    ticketCount: number,
    price: number,
    previousCount: number
  ) => {
    const priceDifference = (ticketCount - previousCount) * price;
    setTotalPrice((prevTotal) => prevTotal + priceDifference);
    setTotalQty((prevQty) => prevQty + (ticketCount - previousCount));
  };

  if (!event) {
    return <CircularLoader />;
  }

  const handlePointUsage = () => {
    if (
      userPoint?.points &&
      (userPoint.points <= totalPrice || userPoint.points != 0)
    ) {
      setUserPointUsed((prev) => !prev);
    }
  };

  const handleCheckout = async () => {
    if (totalQty == 0) {
      toast({
        title: "Checkout Failed",
        description: "You have to buy at least 1 ticket",
        variant: "destructive",
      });
      return;
    }
    const data = {
      eventId: id,
      voucherId: voucherIdValue === null ? null : voucherIdValue,
      totalQty: totalQty,
      finalPrice: finalPrice,
      totalDiscount: totalDiscount,
      originalPrice: totalPrice,
      usePoint: userPointUsed ? userPoint?.points : 0,
      tickets: ticketRows,
    };

    try {
      const result = createTransactionSchema.parse(data);
      const response = await checkoutTransaction(result);
      if (response.success == true) {
        toast({
          title: "Checkout Success",
          description: "Your checkout was a success",
          className: "bg-green-600 text-white",
        });
        router.push("/order-success");
        console.log("Checkout successful!");
      }
    } catch (error) {
      console.error("An error occurred during checkout:", error);
    }
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoucherId =
      e.target.value === "null" ? null : parseInt(e.target.value);
    setVoucherIdValue(selectedVoucherId);
    setSelectedVoucher(e.target.value);
  };

  const addTicketRow = (id: number, qty: number, price: number) => {
    const existingTicketIndex = ticketRows.findIndex(
      (row) => row.ticketId === id
    );
    if (existingTicketIndex !== -1) {
      const updatedTicketRows = [...ticketRows];
      updatedTicketRows[existingTicketIndex] = {
        ...updatedTicketRows[existingTicketIndex],
        qty,
        price,
      };
      setTicketRows(updatedTicketRows);
    } else {
      const newTicketRow = {
        ticketId: id,
        price,
        qty,
      };
      setTicketRows([...ticketRows, newTicketRow]);
    }
  };

  const removeTicketRow = (id: number) => {
    const updatedRows = ticketRows.filter((row) => row.ticketId !== id);
    setTicketRows(updatedRows);
  };

  if (loading) {
    return (
      <div className="flex flex-center">
        <CircularLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="block py-6">
          <Link href="/" className="text-luxtix-1">
            <AiOutlineArrowLeft size={25} />
          </Link>
        </div>
        <div
          key={event.id}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div>
            <Image
              className="w-full rounded-lg"
              src={event.eventImage}
              alt="Event Image"
              width={500}
              height={500}
            />
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="bg-white rounded-full">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={event.organizerAvatar}
                    alt={`${event.organizerName} Logo`}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">
                  {event.organizerName}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{event.eventName}</h2>
              <div className="flex items-center text-luxtix-8 mt-2">
                <span className="text-sm sm:text-md">
                  {format(new Date(event.eventDate), "cccc")},{" "}
                  {format(new Date(event.eventDate), "d MMMM yyyy")}
                </span>
              </div>
              <p className="text-sm sm:text-md">
                {format(
                  new Date(`${event.eventDate}T${event.startTime}`),
                  "hh:mm a"
                )}{" "}
                -{" "}
                {format(
                  new Date(`${event.eventDate}T${event.endTime}`),
                  "hh:mm a"
                )}
              </p>
              <p className="mt-2 text-luxtix-8">{event.address}</p>
              <div className="mt-4">
                <label className="block text-sm font-bold text-luxtix-8 pb-4">
                  Ticket Tiers
                </label>
                <div className="space-y-4">
                  {event.tickets.map((ticket, index) => (
                    <TicketTiers
                      {...ticket}
                      key={ticket.id}
                      index={index}
                      onTicketCountChange={handleTicketCountChange}
                      addTicketRow={addTicketRow}
                      removeTicketRow={removeTicketRow}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">{event.eventName}</h3>
              <div className="border-b border-luxtix-7 mb-4"></div>
              <div className="flex justify-between mb-2">
                <span>Date</span>
                {format(new Date(event.eventDate), "cccc")},{" "}
                {format(new Date(event.eventDate), "d MMMM yyyy")}
              </div>
              <div className="flex justify-between mb-2">
                <span>Time</span>
                <span>
                  {format(
                    new Date(`${event.eventDate}T${event.startTime}`),
                    "hh:mm a"
                  )}{" "}
                  -{" "}
                  {format(
                    new Date(`${event.eventDate}T${event.endTime}`),
                    "hh:mm a"
                  )}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>City</span>
                <span>{event.cityName}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Venue</span>
                <span>{event.venueName}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-3/4">
                  <label className="block text-sm font-bold text-luxtix-8 pb-4">
                    Select Voucher
                  </label>
                  <select
                    value={selectedVoucher}
                    onChange={handleVoucherChange}
                    className="w-full mr-2 p-2 border rounded-lg"
                    disabled={totalPrice == 0}
                  >
                    <option value="null">Select Voucher</option>
                    {event.vouchers.map((voucher) => (
                      <option
                        key={voucher.voucherId}
                        value={voucher.voucherId}
                        className="flex justify-between items-center"
                      >
                        {voucher.voucherName + "\t"}({voucher.voucherRate}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="usePoints"
                  className="mr-2"
                  onChange={handlePointUsage}
                  checked={userPointUsed}
                />
                <label htmlFor="usePoints">Use Points</label>
                <span className="ml-auto">
                  {userPoint?.points.toLocaleString("de-DE", {
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total ({totalQty} item)</span>
                <span>{`IDR ${totalPrice.toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                })}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount</span>
                <span>{`IDR ${totalDiscount.toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                })}`}</span>
              </div>
              <div className="flex justify-between font-bold mb-4">
                <span>Final Price</span>
                <span>{`IDR ${finalPrice.toLocaleString("de-DE", {
                  minimumFractionDigits: 0,
                })}`}</span>
              </div>
              <button
                className="btn-anim w-full py-2 px-4 bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 font-bold rounded-lg"
                onClick={handleCheckout}
              >
                Checkout Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
