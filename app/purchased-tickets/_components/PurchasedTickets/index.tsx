"use client";

import AddReview from "../AddReview";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Barcode from "react-barcode";
import Modal from "@/components/Modal";
import { formatTime } from "@/utils/formatTime";
import transactionDetail from "@/hooks/useTransactionDetail";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useTransactionContext } from "@/contexts/TicketListContext";
import { TransactionDetail } from "@/types/transaction";

function PurchasedTickets() {
  const { userTransactionList } = useTransactionContext();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail>();
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [transactionEventId, setTransactionEventId] = useState<number>(0);
  const [isTransactionDetailModalOpen, setTransactionDetailModalOpen] =
    useState(false);
  const { getDetailTransaction } = transactionDetail();

  const { ref, inView } = useInView();
  const { transactionLimit, setTransactionLimit } = useTransactionContext();

  useEffect(() => {
    if (inView) {
      setTransactionLimit(transactionLimit + 1);
    }
  }, [inView, setTransactionLimit]);

  const closeEventDetailsModal = () => {
    setTransactionDetailModalOpen(false);
  };

  const openEventDetailsModal = async (id: number) => {
    try {
      const data = await getDetailTransaction(id);
      setSelectedTransaction(data);
      setTransactionDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
    }
  };

  const openReviewModal = (id: number) => {
    setTransactionEventId(id);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => setReviewModalOpen(false);

  const modalTicket =
    "bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative h-4/5 custom-scrollbar overflow-y-scroll";
  const modalReview =
    "bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative";

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="block sm:py-6">
        <Link href="/" className="text-luxtix-1">
          <AiOutlineArrowLeft size={25} />
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Purchased Tickets</h2>
        {userTransactionList.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTransactionList.data.map((transaction, index) => (
              <div
                key={transaction.transactionId}
                className="border rounded-lg overflow-hidden shadow-sm relative"
                ref={
                  index === userTransactionList.data.length - 1 &&
                  userTransactionList.data.length <
                    userTransactionList.totalData
                    ? ref
                    : null
                }
              >
                <div className="relative">
                  <Image
                    width={200}
                    height={200}
                    src={transaction.eventImage}
                    alt={transaction.eventName}
                    className="w-full h-40 object-cover object-top cursor-pointer"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-luxtix-5 flex items-center">
                      <h3>
                        {format(new Date(transaction.eventDate), "cccc")},{" "}
                        {format(new Date(transaction.eventDate), "d MMM yyyy")}
                      </h3>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-luxtix-1 mb-2">
                      {transaction.eventName}
                    </h3>
                    <div className="flex justify-between gap-4 mt-4">
                      <button
                        onClick={() =>
                          openEventDetailsModal(transaction.transactionId)
                        }
                        className="w-full btn-anim bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 text-xs px-2 py-1 sm:px-4 sm:py-2 rounded-lg"
                      >
                        Tickets Details
                      </button>
                      {transaction.isDone == false ||
                      transaction.canReview == false ? (
                        <></>
                      ) : (
                        <>
                          <button
                            onClick={() => openReviewModal(transaction.eventId)}
                            className="w-full btn-anim bg-luxtix-4 text-luxtix-1 hover:bg-luxtix-2 text-xs px-2 py-1 sm:px-4 sm:py-2 rounded-lg"
                          >
                            Add Review
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-luxtix-1">No purchased tickets yet.</p>
        )}
      </div>

      <Modal
        isOpen={isTransactionDetailModalOpen == true}
        onClose={closeEventDetailsModal}
        modalDesign={modalTicket}
      >
        <div className="flex flex-col gap-4">
          {selectedTransaction?.tickets.map((ticket) => (
            <div
              className="max-w-sm mx-auto bg-luxtix-4 text-luxtix-1 rounded-2xl"
              key={ticket.id}
            >
              <h2 className="text-sm font-extralight p-1 bg-luxtix-1 text-white text-center rounded-t-xl">
                ©Luxtix
              </h2>
              <div className="p-4 text-center">
                <h1 className="text-xl font-bold">
                  {selectedTransaction.eventName}
                </h1>
                <div>
                  <p className="text-lg font-medium">
                    {selectedTransaction.cityName}
                  </p>
                </div>
              </div>
              <Image
                src={selectedTransaction.eventImage}
                alt="Event Poster"
                className="w-full"
                width={200}
                height={200}
              />
              <div className="grid grid-cols-3 gap-4 p-4 text-center">
                <div>
                  <p className="text-sm">DAY</p>
                  <p className="text-lg font-bold">
                    {format(new Date(selectedTransaction.eventDate), "cccc")}
                  </p>
                </div>
                <div>
                  <p className="text-sm">DATE</p>
                  <p className="text-md font-bold">
                    {new Date(
                      Date.parse(selectedTransaction.eventDate)
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm">VENUE</p>
                  <p className="text-lg font-bold">
                    {selectedTransaction.venueName}
                  </p>
                </div>
                <div>
                  <p className="text-sm">TIME</p>
                  <p className="text-md font-bold">
                    {formatTime(selectedTransaction.startTime)} -{" "}
                    {formatTime(selectedTransaction.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm">QTY</p>
                  <p className="text-lg font-bold">{ticket.ticketQty}</p>
                </div>
                <div>
                  <p className="text-sm">TIER</p>
                  <p className="text-lg font-bold">{ticket.ticketName}</p>
                </div>
              </div>
              <p className="text-[10px] px-8 text-center font-light italic">
                {`${
                  selectedTransaction.isOnline === false
                    ? "Please scan the barcode at the venue to receive your entry ticket. Double-check your quantity and tier before leaving the ticketing area."
                    : "Online event link will be sent to your email 1 hour before the event starts."
                }`}
              </p>
              <div className="p-4 flex justify-center">
                <Barcode
                  value={`${ticket.id}${new Date(
                    selectedTransaction.eventDate
                  ).getTime()}`}
                  height={50}
                  fontSize={10}
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        modalDesign={modalReview}
      >
        <AddReview id={transactionEventId} onClose={closeReviewModal} />
      </Modal>
    </div>
  );
}

export default PurchasedTickets;
