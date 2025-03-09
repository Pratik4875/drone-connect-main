"use client";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useMemo, useState } from "react";
import { useCompanyPilotsQuery } from "@/hooks/useCompanyPilot";
import debounce from "lodash.debounce";
import { useQueryState } from "nuqs";
import userStore from "@/store/userStore";

export default function DemoPage() {
  const { user, isAuthenticated, loading } = userStore();
  const id: string | null =
    !loading && isAuthenticated ? user?.company_id ?? null : null;
  const [searchTerm, setSearchTerm] = useQueryState("name", {
    defaultValue: "",
  });
  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "all",
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

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useCompanyPilotsQuery(
    debouncedSearchTerm,
    { selectedCategory, id, pageParam: page }
  );

  const pilots = data?.pilots || [];

  if (isError) {
    return <div>Error soemthing went wrong : {error.message}</div>;
  }

  return (
    <GridOneWrapper>
      <div className="w-full mx-auto">
      <div className="mx-auto w-full py-10">
            <DataTable
                columns={columns}
                data={pilots}
                page={page}
                totalPage={data?.totalPages}
                fetchNextPage={() => {
                  if (page < data?.totalPages) {
                    setPage((prev) => prev + 1);
                  }
                }}
                fetchPreviousPage={() => {
                  if (page > 0) {
                    setPage((prev) => prev - 1); // Use cached page
                  }
                }}
                hasPreviousPage={page > 1 ? true : false}
                hasNextPage={page < data?.totalPages ? true : false}
                setSelectedCategory={setSelectedCategory}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                isLoading={isLoading}
              />
          </div>
      </div>
    </GridOneWrapper>
  );
}
