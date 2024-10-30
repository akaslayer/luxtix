"use client";

import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import { useLandingEvents } from "@/hooks/useLandingEvents";

function PopularEvents() {
  const { events, loading, error } = useLandingEvents("", 6);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:py-8">
        <h2 className="text-3xl font-bold text-luxtix-5 mb-8 mt-8 sm:mt-0">
          Popular Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-[400px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:py-8">
      <h2 className="text-3xl font-bold text-luxtix-5 mb-8 mt-8 sm:mt-0">
        Popular Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link
          href="/events"
          className="btn-anim px-8 sm:px-40 py-4 text-lg border border-luxtix-7 text-luxtix-1 rounded-full"
        >
          See More
        </Link>
      </div>
    </div>
  );
}

export default PopularEvents;
