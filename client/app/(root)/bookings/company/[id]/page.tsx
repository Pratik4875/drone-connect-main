"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Clock3,
  Building2,
  Loader,
  Search,
} from "lucide-react";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBookingComapnyPilot,
  updateBookingStatusCompany,
  updateBookingStatusComplete,
} from "@/api/user_api";
import { format } from "date-fns";
import { GiThunderBlade } from "react-icons/gi";
import { useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type BookingStatus = "pending" | "confirmed" | "rejected";
import debounce from "lodash.debounce";
import { useInView } from "react-intersection-observer";
import { useCompanyPilots } from "@/hooks/useCompanyPilot";
import userStore from "@/store/userStore";
import AvatarProfile from "@/components/Avatar";
import toast from "react-hot-toast";
import { APIError } from "@/types/global";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { user, loading, isAuthenticated } = userStore();
  const {
    data: bookingData,
    isLoading: bookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingComapnyPilot(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const [searchTerm, setSearchTerm] = useQueryState("name", {
    defaultValue: "",
  });
  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "",
  });

  // Debounce search term to reduce API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const updateSearchTerm = useMemo(
    () => debounce(setDebouncedSearchTerm, 500),
    []
  );
  const company_id: string | null =
    !loading && isAuthenticated ? user?.company_id ?? null : null;
  useEffect(() => {
    updateSearchTerm(searchTerm);
    return () => updateSearchTerm.cancel();
  }, [searchTerm, updateSearchTerm]);
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCompanyPilots(debouncedSearchTerm, {
      selectedCategory,
      id: company_id,
    });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const pilots = useMemo(
    () => data?.pages.flatMap((page) => page.pilots) || [],
    [data]
  );
  const mutation = useMutation({
    mutationFn: ({
      status,
      reason,
      pilot_id,
    }: {
      status: BookingStatus;
      reason?: string;
      pilot_id?: string;
    }) => updateBookingStatusCompany(status, id, reason, pilot_id),
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
  interface HandleClickPayload {
    status: BookingStatus;
    reason?: string;
    pilot_id?: string;
  }

  const handleClick = async (status: BookingStatus, pilot_id?: string) => {
    console.log("clickedd");

    const payload: HandleClickPayload = { status };

    if (status === "rejected") {
      if (!reason) return; // Ensure a reason is provided
      payload.reason = reason;
    }

    if (pilot_id) {
      payload.pilot_id = pilot_id; // Include pilot_id only if provided
    }

    mutation.mutate(payload);
  };

  const formattedDate = useMemo(() => {
    if (!bookingData?.date) return "N/A";
    return format(new Date(bookingData.date), "MMMM d, yyyy");
  }, [bookingData?.date]);

  const formattedStartTime = useMemo(() => {
    if (!bookingData?.start_time) return "N/A";
    return format(new Date(bookingData.start_time), "hh:mm a");
  }, [bookingData?.start_time]);

  const formattedEndTime = useMemo(() => {
    if (!bookingData?.end_time) return "N/A";
    return format(new Date(bookingData.end_time), "hh:mm a");
  }, [bookingData?.end_time]);

  if (isBookingError) {
    return <div>Error: {bookingError.message}</div>;
  }
  const isCompleted =
    bookingData?.requests[0]?.status === "confirmed" &&
    new Date(bookingData?.date).setHours(23, 59, 59, 999) <
      new Date().getTime();
  const handleComplete = () => {
    // Mark booking as completed
    completemutation.mutate(id);
  };
  return (
    <GridOneWrapper>
      {bookingLoading ? (
        <Loader />
      ) : (
        <>
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-28 lg:mt-16 mb-10">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <GiThunderBlade className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {bookingData.title}
                    </h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-2" />
                      Booking ID: {id}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusColors[
                      bookingData?.requests[0]?.status as BookingStatus
                    ] || "bg-gray-100 text-gray-800"
                  } capitalize`}
                >
                  {bookingData?.requests[0]?.status ?? "Unknown"}
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
                      {bookingData?.street_address}, {bookingData?.city},{" "}
                      {bookingData?.state} {bookingData?.pincode}
                    </p>
                  </div>
                </div>
                {/* Assigned info */}

                {/* Company */}
                {bookingData.customer_name && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl ">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Customer
                      </p>
                      <p className="text-base text-gray-800">
                        {bookingData?.customer_name}
                      </p>
                    </div>
                  </div>
                )}
                {bookingData.pilot_id && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl ">
                    <Building2 className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pilot</p>
                      <p className="text-base text-gray-800">
                        {bookingData?.pilotname}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isCompleted && (
              <div className="p-8">
              <Button onClick={handleComplete}>Mark as completed</Button>

              </div>
            )}

            {bookingData?.requests[0]?.status === "pending" && (
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant={"default"}>
                      Select Pilot
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={"md:max-w-2xl overflow-y-scroll max-h-dvh"}
                  >
                    <DialogHeader>
                      <DialogTitle>Select Pilot</DialogTitle>
                      <DialogDescription>
                        Select the pilot for booking{" "}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mb-0 flex md:flex-row flex-col gap-3">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          placeholder="Search by name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                        />
                      </div>
                      <Select
                        onValueChange={setSelectedCategory}
                        value={selectedCategory}
                      >
                        <SelectTrigger className="md:w-[150px] w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={"all"}>All</SelectItem>

                            <SelectItem value="nano">Nano</SelectItem>
                            <SelectItem value="micro">Micro</SelectItem>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mx-auto w-full">
                      {isLoading && <Loader />}
                      {pilots.length > 0 && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-100 md:p-5 p-2"
                        >
                          {pilots.map((pilot) => (
                            <li
                              className="flex justify-between gap-x-6 py-5"
                              key={pilot.user_id}
                            >
                              <div className="flex min-w-0 gap-x-4">
                                <AvatarProfile
                                  className="md:size-14 size-12"
                                  src={
                                    pilot?.profile
                                      ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${pilot?.profile}`
                                      : ""
                                  } // Display file URL if file selected, else fallback to default src
                                  fallbackClassName="md:text-2xl text-lg"
                                  fallbackText={pilot?.name}
                                />
                                <div className="min-w-0 flex-auto">
                                  <p className="text-sm/6 font-semibold text-gray-900">
                                    {pilot?.name}
                                  </p>
                                  <p className="truncate text-xs/5 text-gray-500 capitalize">
                                    {pilot?.drone_category} Drones
                                  </p>
                                </div>
                              </div>
                              {pilot?.available && (
                                <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                                  {/* <p className="text-sm/6 text-gray-900">{person.role}</p> */}
                                  <Button
                                    variant={"default"}
                                    onClick={() =>
                                      handleClick("confirmed", pilot.user_id)
                                    }
                                  >
                                    Select
                                  </Button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Message when there are no more posts */}
                      {!hasNextPage && (
                        <p className="text-center text-gray-500">
                          No pilots to load.
                        </p>
                      )}
                      {isFetchingNextPage && <Loader />}
                      {hasNextPage && !isFetchingNextPage && (
                        <div ref={ref}>Scroll to load more</div>
                      )}
                      {pilots.length === 0 && (
                        <p className="mt-10 px-5">No pilots</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </>
      )}
    </GridOneWrapper>
  );
};

export default Page;
