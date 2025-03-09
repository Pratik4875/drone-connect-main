/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useQueryState } from "nuqs";
import debounce from "lodash.debounce";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { useInView } from "react-intersection-observer";
import CompanyCard from "./company-card";
import { useCompany } from "@/hooks/useCompany";
import PostCardSkeleton from "../blog/main-card-skeleton";

export default function DroneCompanyFinder() {
  // Query state hooks
  const [searchTerm, setSearchTerm] = useQueryState("name", {
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

  // Fetch pilots using debounced search term
  // Fetch pilots using debounced search term and other filters
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useCompany(debouncedSearchTerm);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const companys = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data]
  );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <GridOneWrapper>
      {/* Header */}
      <motion.header
        className="mb-8 mt-28 md:mt-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Find Your Perfect Drone Company
        </h1>
        <p className="text-gray-600">
          Discover skilled drone pilots from the company for your next event or
          project
        </p>
      </motion.header>

      {/* Search & Filters */}
      <div className="mb-8 flex">
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
      </div>

      {/* Loading & Results */}
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8 mx-auto">
        {companys.map(
          (company, index) =>
            company?.name && (
              <CompanyCard
                id={company?._id}
                name={company?.name}
                profile={company?.logo}
                key={index}
              />
            )
        )}
        {isFetchingNextPage && <Loader />}
      </div>

      {/* Load More */}
      {!hasNextPage && !isLoading && (
        <p className="text-center text-gray-500 mb-5">
          No more comapny to load.
        </p>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={ref} className="mb-5">
          Scroll to load more
        </div>
      )}
    </GridOneWrapper>
  );
}
