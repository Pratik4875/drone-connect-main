import { getAllPilots } from "@/api/user_api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePilots = (
  searchTerm: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { available, companyPilots, selectedState, selectedCity, selectedDistrict, selectedPincode, selectedCategory }: any
) => {
  return useInfiniteQuery({
    queryKey: [
      "pilots",
      searchTerm,
      available,
      companyPilots,
      selectedState,
      selectedCity,
      selectedDistrict,
      selectedPincode,
      selectedCategory,
    ], // Depend on all filters, including searchTerm
    queryFn: ({ pageParam }) =>
      getAllPilots({
        pageParam,
        searchTerm,
        available,
        companyPilots,
        selectedState,
        selectedCity,
        selectedDistrict,
        selectedPincode,
        selectedCategory
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
