"use client";
import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Clock3,
  Building2,
  Loader,
} from "lucide-react";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBookingComapnyPilot,
  updateBookingStatus,
  updateBookingStatusComplete,
} from "@/api/user_api";
import { format } from "date-fns";
import { GiThunderBlade } from "react-icons/gi";
import { useMemo } from "react";
type BookingStatus = "pending" | "confirmed" | "rejected";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["single-booking", id],
    queryFn: () => getBookingComapnyPilot(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const formattedDate = useMemo(() => {
    if (!data?.date) return "N/A";
    return format(new Date(data.date), "MMMM d, yyyy");
  }, [data?.date]);

  const formattedStartTime = useMemo(() => {
    if (!data?.start_time) return "N/A";
    return format(new Date(data.start_time), "hh:mm a");
  }, [data?.start_time]);

  const formattedEndTime = useMemo(() => {
    if (!data?.end_time) return "N/A";
    return format(new Date(data.end_time), "hh:mm a");
  }, [data?.end_time]);

  const mutation = useMutation({
    mutationFn: ({
      status,
      reason,
    }: {
      status: BookingStatus;
      reason?: string;
    }) => updateBookingStatus(status, id, reason),
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["single-booking"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const completemutation = useMutation({
    mutationFn: updateBookingStatusComplete,
    onMutate: () => {
      const toastId = toast.loading("Adding...");
      return { toastId }; // Return the toast ID to access it later
    },
    onSuccess: async (data, variables, context) => {
      toast.success("Successfully added!", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["booking"] }); // Invalidate the 'socials' query to refetch data
    },
    onError: (error: APIError, _variables, context) => {
      // Update the toast to show error
      toast.error(`Add to failed: ${error.response.data.message}`, {
        id: context?.toastId,
      });
    },
  });
  const handleClick = async (status: BookingStatus) => {
    if (status === "rejected") {
      if (!reason) return; // Ensure a reason is provided
      mutation.mutate({ status, reason });
    } else {
      mutation.mutate({ status });
    }
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const isCompleted =
    data?.requests[0]?.status === "confirmed" &&
    new Date(data?.date).setHours(23, 59, 59, 999) < new Date().getTime();
  const handleComplete = () => {
    // Mark booking as completed
    completemutation.mutate(id);
  };
  return (
    <GridOneWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-28 lg:mt-16">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <GiThunderBlade className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {data.title}
                    </h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-2" />
                      Booking ID: {id}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusColors[data?.requests[0]?.status as BookingStatus] ||
                    "bg-gray-100 text-gray-800"
                  } capitalize`}
                >
                  {data?.requests[0]?.status ?? "Unknown"}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created On */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl md:col-span-1">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Scheduled Date
                    </p>
                    <p className="text-base text-gray-800">{formattedDate}</p>
                  </div>
                </div>

                {/* Scheduled Date & Time */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl md:col-span-1">
                  <Clock3 className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Scheduled Time
                    </p>
                    <p className="text-base text-gray-800">
                      <span className="flex items-center">
                        {formattedStartTime} - {formattedEndTime}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl md:col-span-2">
                  <MapPin className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-base text-gray-800">
                      {data?.street_address}, {data?.city}, {data?.state}{" "}
                      {data?.pincode}
                    </p>
                  </div>
                </div>
                {/* Assigned info */}

                {/* Company */}
                {!data.pilot_id && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl md:col-span-2">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Customer
                      </p>
                      <p className="text-base text-gray-800">
                        {data?.customer_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data?.requests[0]?.status === "pending" && (
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-5">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant={"destructive"}>
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Rejection Reason</DialogTitle>
                      <DialogDescription>
                        Why you want to reject the booking?{" "}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="reason" className="sr-only">
                          Reason
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder="Enter reason here"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => handleClick("rejected")}
                      >
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  className="w-full"
                  onClick={() => handleClick("confirmed")}
                >
                  Confirm
                </Button>
              </div>
            )}
            {isCompleted && (
              <div className="p-8">
                <Button onClick={handleComplete}>Mark as completed</Button>
              </div>
            )}
          </div>
        </>
      )}
    </GridOneWrapper>
  );
};

export default Page;
