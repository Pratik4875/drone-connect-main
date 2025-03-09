import { getAllPost } from "@/api/user_api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getAllPost,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.currentPage < lastPage?.totalPages
        ? lastPage?.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
  });
};
