"use client";
import EventCard from "@/components/event-card";
import { GridTwoWrapper } from "@/components/GridTwoWrapper";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import RightSidebar from "@/components/sidebar-right";
import EventCardSkeleton from "@/components/skeletons/event-card-skeleton";
import { useEvents } from "@/hooks/useEvents";
import { useQueryState } from "nuqs";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import debounce from "lodash.debounce";
import EventFilter from "./filter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [searchTerm, setSearchTerm] = useQueryState("name", {
    defaultValue: "",
  });
  const [selectedState, setSelectedState] = useQueryState("state", {
    defaultValue: "",
  });
  const [selectedCity, setSelectedCity] = useQueryState("city", {
    defaultValue: "",
  });

  // Debounce search term to reduce API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const updateSearchTerm = useMemo(
    () => debounce(setDebouncedSearchTerm, 500),
    []
  );

  useEffect(() => {
    updateSearchTerm(searchTerm);
    return () => updateSearchTerm.cancel();
  }, [searchTerm, updateSearchTerm]);
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useEvents(debouncedSearchTerm, {
    selectedState,
    selectedCity,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const events = data?.pages.flatMap((page) => page.data) || [];

  console.log(events);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <GridTwoWrapper>
        <MainContentWrapper>
          <div className="mb-8 flex w-full">
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
            <EventFilter
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </div>
          <div className="flex flex-col gap-5 w-full">
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            {events.map((event, index) => (
              <EventCard
                key={index}
                title={event.name}
                description={event.desc}
                street={event.street_addr}
                state={event.state}
                city={event.city}
                pincode={event.pincode}
                date={event.start_ts}
                start_time={event.start_ts}
                end_time={event.end_ts}
                company_name={event.company_info.name}
                company_id={event.company_id}
                register_link={event.reg_link}
                imageUrl={event.image}
                eventId={event._id}
              />
            ))}
            {/* Message when there are no more posts */}
            {!hasNextPage && !isLoading && (
              <p className="text-center text-gray-500 my-auto">
                No events to load.
              </p>
            )}
            {isFetchingNextPage &&
              Array.from({ length: 5 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            {hasNextPage && !isFetchingNextPage && (
              <div ref={ref}>Scroll to load more</div>
            )}
          </div>
        </MainContentWrapper>
        <RightSidebar />
      </GridTwoWrapper>
    </>
  );
};

export default Page;
