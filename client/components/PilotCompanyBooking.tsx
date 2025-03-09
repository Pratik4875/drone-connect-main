"use client";

import { GridOneWrapper } from "@/components/GridOneWarpper";
import React, { useEffect, useMemo, useState } from "react";
// import BookingCard from "./booking-card";
import { useQuery } from "@tanstack/react-query";
import { getPilotCompanyBookings } from "@/api/user_api"; // API function
import { ChevronLeft, ChevronRight, Loader, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import debounce from "lodash.debounce";
import BookingCard from "@/app/(root)/bookings/customer/booking-card";

const PilotCompanyPage = ({ type }: { type: "pilot" | "company" }) => {
  // Search Term State with Debounce
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const updateSearchTerm = useMemo(
    () => debounce(setDebouncedSearchTerm, 500),
    []
  );
  useEffect(() => {
    updateSearchTerm(searchTerm);
    return () => updateSearchTerm.cancel();
  }, [searchTerm, updateSearchTerm]);

  // Booking Status Tabs
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "pending",
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 5; // Number of bookings per page

  // Fetch Bookings Data for Pilot/Company
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["bookings", activeTab, debouncedSearchTerm, page],
    queryFn: () =>
        getPilotCompanyBookings({
        status: activeTab,
        title: debouncedSearchTerm,
        page,
        limit,
      }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Extract API Response Data
  const bookings = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <GridOneWrapper>
      <div className="bg-white shadow-xl my-10 max-w-4xl mx-auto rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">Your Requests</h2>
          <p className="text-indigo-100 mt-2">
            View and manage assigned bookings
          </p>
        </div>

        {/* Tabs for filtering bookings */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6 overflow-x-auto" aria-label="Tabs">
            {(["pending", "confirmed", "completed", "rejected"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1); // Reset page on tab change
                  }}
                  className={`${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Search & Add Booking */}
        <div className="border-r border-gray-200">
          <div className="p-6">
            <div className="flex space-x-2 w-full">
              {/* Search Input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Bookings List */}
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="flex flex-col space-y-5 my-10">
                  {bookings.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    bookings.map((booking: any) => (
                      <BookingCard
                        key={booking._id}
                        bookingId={booking._id}
                        city={booking.city}
                        date={booking.date}
                        state={booking.state}
                        end_time={booking.end_time}
                        start_time={booking.start_time}
                        status={booking.requests[0].status}
                        street_address={booking.street_address}
                        title={booking.title}
                        type={type}
                        pincode={booking.pincode}
                        customerName={booking.customerInfo?.name} // Show customer name instead of pilot/company
                      />
                    ))
                  ) : (
                    <p>No bookings available</p>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{page}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <button
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GridOneWrapper>
  );
};

export default PilotCompanyPage;
