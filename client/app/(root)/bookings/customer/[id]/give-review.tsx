import { addRating } from "@/api/user_api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { APIError } from "@/types/global";
import { useMutation } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function GiveReview({ bookingId }: { bookingId: string }) {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: addRating,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const handleSubmitReview = () => {
    // Trim comment to remove extra spaces
    const trimmedComment = comment.trim();

    // Validation checks
    if (newRating < 1 || newRating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    if (!trimmedComment) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (trimmedComment.length < 10) {
      toast.error("Comment must be at least 10 characters long.");
      return;
    }

    mutation.mutate(
      {
        rating: newRating,
        review: trimmedComment,
        booking_id: bookingId,
      },
      {
        onSuccess: () => {
          setNewRating(0); // Reset rating
          setComment(""); // Clear comment
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Give Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <h3 className="font-medium">Write Your Review</h3>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                star <= (hoverRating || newRating)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setNewRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {newRating > 0
              ? `You selected ${newRating} stars`
              : "Select a rating"}
          </span>
        </div>

        <Textarea
          placeholder="Share your experience with the pilot..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />

        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmitReview} disabled={newRating === 0}>
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
