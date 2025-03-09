import { getAllCompanyPilots } from "@/api/user_api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useCompanyPilots = (
  searchTerm: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { selectedCategory, id }: any
) => {
  return useInfiniteQuery({
    queryKey: ["company-pilots", searchTerm, selectedCategory, id], // Depend on all filters, including searchTerm
    queryFn: ({ pageParam }) =>
        getAllCompanyPilots({
        pageParam,
        searchTerm,
        selectedCategory,
        id
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.currentPage < lastPage?.totalPages
        ? lastPage?.currentPage + 1
        : undefined;
    },
    getPreviousPageParam: (_, allPages) => {
      return allPages.length > 1 ? allPages.length - 1 : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: !!id
  });
};


export const useCompanyPilotsQuery = (
  searchTerm: string,
  { selectedCategory, id, pageParam }: { selectedCategory: string; id: string | null; pageParam: number}
) => {  
  return useQuery({
    queryKey: ["company-pilots-list", searchTerm, selectedCategory, id, pageParam], // Depend on all filters & page
    queryFn: () =>
      getAllCompanyPilots({
        pageParam,
        searchTerm,
        selectedCategory,
        id,
      }),
    enabled: !!id, // Only fetch when ID is available
    refetchOnWindowFocus: false,
  });
};