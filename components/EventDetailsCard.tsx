"use client";

import { EventDetailType } from "@/types/event";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { BiTimeFive, BiCalendarAlt } from "react-icons/bi";
import { GiTicket } from "react-icons/gi";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useIntrestedEvent } from "@/hooks/useIntrestedEvent";

interface EventDetailsCardProps {
  event: EventDetailType;
}

function EventDetailsCard({ event }: EventDetailsCardProps) {
  const [interested, setInterested] = useState<boolean>(false);
  const { data: session } = useSession()
  const { toogleIntrested } = useIntrestedEvent()
  const toggleInterested = async () => {
    setInterested(!interested);
    await toogleIntrested(event.id)
  };

  return (
    <div>
      <div className="relative">
        <Image
          className="w-full h-auto sm:h-96 rounded-lg sm:pb-8 object-cover"
          src={event.eventImage}
          alt="Event Banner"
          width={1200}
          height={600}
        />
      </div>
      <div className="py-4">
        <div className="flex items-center justify-between py-4 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-luxtix-1">
            {event.eventName}
          </h1>
          <button onClick={toggleInterested} className="btn-anim" disabled={!session}>
            {interested ? (
              <AiFillStar
                size={40}
                className="fill-luxtix-2 p-1 bg-white rounded-full"
              />
            ) : (
              <AiOutlineStar
                size={40}
                className="fill-luxtix-1 p-1 bg-white rounded-full"
              />
            )}
          </button>
        </div>
        <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-luxtix-5">
              Date and Time
            </h2>
            <div className="flex items-center text-luxtix-8">
              <BiCalendarAlt size={20} className="mr-1" />
              <span>
                {format(new Date(event.eventDate), "cccc")},{" "}
                {format(new Date(event.eventDate), "d MMMM yyyy")}
              </span>
            </div>
            <div className="flex items-center text-luxtix-8">
              <BiTimeFive size={20} className="mr-1" />
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
            <div className="flex items-center text-luxtix-3">
              <GiTicket size={20} className="mr-1" />
              <span>
                {event.tickets.length === 0
                  ? "Free"
                  : `From IDR ${Math.min(
                    ...event.tickets.map((ticket) => ticket.price)
                  ).toLocaleString()}`}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
            <Link href={`/events/${event.id}/transactions`}>
              <button className="btn-anim bg-luxtix-6 text-luxtix-1 hover:bg-luxtix-2 px-4 py-2 rounded-lg">
                Buy Tickets
              </button>
            </Link>
          </div>
        </div>
        <div className="py-4">
          <h2 className="text-lg font-semibold text-luxtix-5">Location</h2>
          <div className="flex items-center text-luxtix-8">
            <CiLocationOn size={20} className="mr-1" />
            <span>{event.address}</span>
          </div>
        </div>
        <div className="py-4">
          <h2 className="text-lg font-semibold text-luxtix-5">Hosted by</h2>
          <div className="flex items-center">
            <Image
              className="h-10 w-10 rounded-full"
              src={event.organizerAvatar}
              alt="Host Logo"
              width={40}
              height={40}
            />
            <span className="ml-2 text-luxtix-1">{event.organizerName}</span>
          </div>
        </div>
        <div className="py-4">
          <h2 className="text-lg font-semibold text-luxtix-5">
            Event Description
          </h2>
          <p className="text-luxtix-1 mt-1">{event.description}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsCard;
