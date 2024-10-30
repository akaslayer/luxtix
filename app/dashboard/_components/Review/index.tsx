"use client";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import ReviewCard from "./ReviewCard";
import { usePurchasedEvents } from "@/contexts/PurchasedEventsContext";
import { useEffect, useState } from "react";
import useEventReview from "@/hooks/useEventReview";

interface eventList {
  data: {
    id: number;
    rating: number;
    comments: string;
    type: string;
    reviewerName: string;
  }[];
  totalPages: number;
  currentPage: number;
}

function Review() {
  const { eventId } = usePurchasedEvents();
  const [page, setPage] = useState<number>(0);
  const { fetchEventReview } = useEventReview();
  const [eventList, setEventList] = useState<eventList>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchEventReview(eventId, page);
        setEventList(result);
        console.log(result);
      } catch (error) {
        console.error("Failed to fetch event review:", error);
      }
    };
    fetchData();
  }, [eventId, page]);

  const handleNextPage = () => {
    if (page < eventList?.totalPages! - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
      <h2 className="text-lg font-semibold text-luxtix-5 mb-4">Reviews</h2>
      <div className="hidden sm:grid grid-cols-5 gap-4 p-4 bg-secondary text-secondary-foreground font-semibold sm:text-center">
        <div className="col-span-1">#</div>
        <div className="col-span-1">Name</div>
        <div className="col-span-1">Subject</div>
        <div className="col-span-1">Review</div>
        <div className="col-span-1">Rating</div>
      </div>
      <div>
        {eventList?.data.map((review, index) => (
          <ReviewCard key={index} {...review} index={index} />
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 relative">
        {eventList &&
          (eventList?.currentPage > 0 ? (
            <button onClick={handlePrevPage}>
              <AiOutlineArrowLeft
                size={25}
                className="btn-anim text-luxtix-1 absolute left-0"
              />
            </button>
          ) : (
            <></>
          ))}
        {eventList &&
          (eventList?.currentPage < eventList.totalPages - 1 ? (
            <button onClick={handleNextPage}>
              <AiOutlineArrowRight
                size={25}
                className="btn-anim text-luxtix-1 absolute right-0"
              />
            </button>
          ) : (
            <></>
          ))}
      </div>
    </div>
  );
}

export default Review;
