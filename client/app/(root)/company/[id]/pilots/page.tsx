"use client";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useCompanyPilots } from "@/hooks/useCompanyPilot";
import { useQueryState } from "nuqs";
import debounce from "lodash.debounce";
import CompanyPilotCard from "../compay-pilot-card";
const Page = () => {
  const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  console.log(id);
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
  } = useCompanyPilots(debouncedSearchTerm, {
    selectedCategory,
    id,
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

  console.log(pilots);

  if (isError) {
    return <div>Error soemthing went wrong : {error.message}</div>;
  }
  return (
    <GridOneWrapper>
      <div className="lg:col-span-2 max-w-4xl mx-auto py-10">
        <div className="mt-0 w-full bg-slate-100 rounded-md p-2">
          <h1 className="font-bold text-3xl p-5">All Pilots</h1>
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
              <ul role="list" className="divide-y divide-gray-100 md:p-5 p-2">
                {pilots.map((pilot) => (
                  <CompanyPilotCard
                    category={pilot.drone_category}
                    name={pilot.name}
                    profileImage={pilot.profile}
                    user_id={pilot.user_id}
                    key={pilot.user_id}
                  />
                ))}
              </ul>
            )}
            {/* Message when there are no more posts */}
            {!hasNextPage && (
              <p className="text-center text-gray-500">No pilots to load.</p>
            )}
            {isFetchingNextPage && <Loader />}
            {hasNextPage && !isFetchingNextPage && (
              <div ref={ref}>Scroll to load more</div>
            )}
            {pilots.length === 0 && <p className="mt-10 px-5">No pilots</p>}
          </div>
        </div>
      </div>
    </GridOneWrapper>
  );
};

export default Page;
