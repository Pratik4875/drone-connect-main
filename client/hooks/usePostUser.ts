import { getUserAllPost } from "@/api/user_api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePostsUser = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["posts", id], // Include `id` for unique cache
    queryFn: ({ pageParam = 1 }) => getUserAllPost(id, pageParam), // Pass pageParam correctly
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.currentPage < lastPage?.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
