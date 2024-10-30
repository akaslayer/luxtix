import { ReviewType } from "@/types/review";

interface ReviewProps {
  id: number,
  rating: number,
  comments: string,
  type: string,
  reviewerName: string
  index: number
}

function ReviewCard({ id, rating, comments, type, reviewerName, index }: ReviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 border-b sm:text-center bg-white">
      <div className="col-span-1 text-sm sm:text-base break-words">
        {index + 1}
      </div>
      <div className="col-span-1 text-sm sm:text-base break-words">
        {reviewerName}
      </div>
      <div className="col-span-1 text-sm sm:text-base break-words">
        {type}
      </div>
      <div className="col-span-1 text-sm sm:text-base break-words">
        {comments}
      </div>
      <div className="col-span-1 text-sm sm:text-base break-words">
        {`${rating}/5`}
      </div>
    </div>
  );
}

export default ReviewCard;
