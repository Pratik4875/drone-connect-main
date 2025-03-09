import { getAllEvents } from "@/api/user_api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useEvents = (
  searchTerm: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { selectedState, selectedCity }: any
) => {
  return useInfiniteQuery({
    queryKey: ["events", searchTerm, selectedState, selectedCity], // Depend on all filters, including searchTerm
    queryFn: ({ pageParam }) =>
      getAllEvents({
        pageParam,
        searchTerm,
        selectedState,
        selectedCity,
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
