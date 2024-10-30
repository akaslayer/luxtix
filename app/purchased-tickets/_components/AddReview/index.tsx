"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { toast } from "@/components/ui/use-toast";
import { useTransactionContext } from "@/contexts/TicketListContext";
import { useSession } from "next-auth/react";

interface ReviewProps {
  id: number;
  onClose: (reviewData?: ReviewFormValues) => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  reviewType: z.enum(
    ["Overall Experience", "Quality of Events", "Improvement"],
    {
      errorMap: () => ({ message: "Please select a review type" }),
    }
  ),
  comment: z
    .string()
    .min(1, "Please enter a comment")
    .max(500, "Comment must be 500 characters or less"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const AddReview: React.FC<ReviewProps> = ({ id, onClose }) => {
  const { getLists } = useTransactionContext();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewType: undefined,
      comment: "",
    },
  });
  const { data: session } = useSession();

  const onSubmit = async (data: ReviewFormValues) => {
    const formData = {
      id,
      rating: data.rating,
      comments: data.comment,
      type: getReviewType(data.reviewType),
    };
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/event-review`,
        {
          credentials: "include",
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Review Submited",
        });
        setTimeout(() => {
          onClose();
          getLists();
        }, 1000);
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const getReviewType = (type: ReviewFormValues["reviewType"]) => {
    switch (type) {
      case "Overall Experience":
        return "Overall";
      case "Quality of Events":
        return "Quality";
      case "Improvement":
        return "Improvement";
      default:
        throw new Error(`Invalid review type: ${type}`);
    }
  };

  return (
    <div className="p-4 bg-background text-foreground">
      <div className="flex items-center mb-8">
        <h1 className="text-lg font-semibold">Add Review</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        onClick={() =>
                          field.onChange(value === field.value ? 0 : value)
                        }
                        className="cursor-pointer"
                      >
                        {field.value >= value ? (
                          <AiFillStar size={30} className="text-luxtix-2" />
                        ) : (
                          <AiOutlineStar size={30} className="text-luxtix-7" />
                        )}
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-center space-x-2">
                    {[
                      "Overall Experience",
                      "Quality of Events",
                      "Improvement",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => field.onChange(option)}
                        className={`p-2 border rounded-full text-xs ${
                          field.value === option
                            ? "bg-luxtix-4 text-luxtix-1"
                            : "bg-white text-luxtix-1"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-luxtix-6 hover:bg-luxtix-2"
          >
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddReview;
