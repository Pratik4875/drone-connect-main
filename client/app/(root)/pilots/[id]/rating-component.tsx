"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import AvatarProfile from "@/components/Avatar";

interface RatingBreakdown {
  [key: string]: number;
}

interface Review {
  rating: number;
  review: string;
  customerName: string;
  customerProfile?: string;
  created_at: string;
}

interface RatingData {
  averageRating: string;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  reviews: Review[];
}

interface RatingComponentProps {
  data?: RatingData;
}

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dmuhioahv/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";

export default function RatingComponent({ data }: RatingComponentProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Customer Reviews</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary section */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold">{data?.averageRating || "0.0"}</div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(data?.averageRating)) 
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {data?.totalReviews || 0} reviews
            </div>
          </div>

          <Separator className="hidden md:block h-16 w-px" orientation="vertical" />

          <div className="flex-1 space-y-2 w-full">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <div className="w-8 text-sm text-right">{star}</div>
                <Star className="w-4 h-4 fill-primary text-primary" />
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${
                        ((data?.ratingBreakdown?.[star] || 0) / (data?.totalReviews || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-sm w-12">
                  {Math.round(
                    ((data?.ratingBreakdown?.[star] || 0) / (data?.totalReviews || 1)) * 100
                  )}
                  %
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Recent Reviews</h3>

          {data?.reviews?.length ? (
            data.reviews.map((review, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-start gap-4">
                  <AvatarProfile
                    className="md:size-10 size-10 mx-auto"
                    src={
                      review.customerProfile
                        ? `${CLOUDINARY_BASE_URL}${review.customerProfile}`
                        : ""
                    }
                    fallbackClassName="text-3xl"
                    fallbackText={review.customerName}
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.customerName}</h4>
                      <span className="text-sm text-muted-foreground">
                        {review.created_at}
                      </span>
                    </div>

                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.review}
                    </p>
                  </div>
                </div>

                <Separator />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No reviews available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
