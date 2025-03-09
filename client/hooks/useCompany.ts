import { getAllCompany } from "@/api/user_api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCompany = (searchTerm: string) => {
  return useInfiniteQuery({
    queryKey: ["company", searchTerm], // Depend on all filters, including searchTerm
    queryFn: ({ pageParam }) =>
      getAllCompany({
        pageParam,
        searchTerm,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.currentPage < lastPage?.totalPages
        ? lastPage?.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
