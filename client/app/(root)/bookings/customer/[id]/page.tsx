"use client";
import React from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Clock3,
  Building2,
  Loader,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooking, updateBookingStatusComplete } from "@/api/user_api";
import { format } from "date-fns";
import { PiDroneLight } from "react-icons/pi";
import { GiThunderBlade } from "react-icons/gi";
import AssignUsercard from "./assign-user-card";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";
import { GiveReview } from "./give-review";
type BookingStatus = "pending" | "confirmed" | "rejected" | "completed";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient(); // Access React Query's query client
  const mutation = useMutation({
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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
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

  const pilotRequests = useMemo(
    () => data?.pilot_requests || [],
    [data?.pilot_requests]
  );
  console.log(data);

  const companyRequests = useMemo(
    () => data?.company_requests || [],
    [data?.company_requests]
  );

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const isCompleted =
  data?.status === "confirmed" &&
  new Date(data?.date).setHours(23, 59, 59, 999) < new Date().getTime();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRequests = (requests: any[], type: "pilot" | "company") => {
    return requests?.map(
      (
        { pilotImage, pilot_name, companyImage, company_name, status, reason },
        index
      ) => {
        const image = type === "pilot" ? pilotImage : companyImage;
        const name = type === "pilot" ? pilot_name : company_name;
        if (!name) {
          return null;
        }
        return (
          <AssignUsercard
            key={index}
            image={image}
            name={name}
            status={status}
            reason={reason}
          />
        );
      }
    );
  };
  
  const handleComplete = () => {
    // Mark booking as completed
    mutation.mutate(id);
  };
  return (
    <GridOneWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-28 lg:mt-10 mb-10">
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
                    statusColors[data?.status as BookingStatus] ||
                    "bg-gray-100 text-gray-800"
                  } capitalize`}
                >
                  {data?.status ?? "Unknown"}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created On */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Scheduled Date
                    </p>
                    <p className="text-base text-gray-800">{formattedDate}</p>
                  </div>
                </div>

                {/* Scheduled Date & Time */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
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
                {data.company_id && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Company
                      </p>
                      <p className="text-base text-gray-800">
                        Company :{" "}
                        {data.company_id
                          ? data?.companyname
                          : "No Company Accepted"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Scheduled Date & Time */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <PiDroneLight className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pilot</p>
                    <p className="text-base text-gray-800">
                      <span className="flex items-center">
                        {data.pilot_id ? data?.pilotname : "No Pilot Accepted"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {isCompleted && <Button onClick={handleComplete}>Mark as completed</Button>}
              {
                data.status === "completed" && <GiveReview bookingId={id} />
              }
              {/* Pilots Section */}

              <div className="mt-8 w-full">
                <Tabs defaultValue="pilot">
                  <TabsList>
                    <TabsTrigger value="pilot">Requested Pilots</TabsTrigger>
                    <TabsTrigger value="company">Requested Company</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pilot" className="w-full">
                    <div className="grid grid-cols-1 gap-4">
                      {renderRequests(pilotRequests, "pilot")}
                    </div>
                  </TabsContent>

                  <TabsContent value="company">
                    <div className="grid grid-cols-1 gap-4">
                      {renderRequests(companyRequests, "company")}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </>
      )}
    </GridOneWrapper>
  );
};

export default Page;
