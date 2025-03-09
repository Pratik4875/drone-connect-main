"use client";
import { GridTwoWrapper } from "@/components/GridTwoWrapper";
import RightSidebar from "@/components/sidebar-right";
import React from "react";
import { useInView } from "react-intersection-observer";
import { usePosts } from "@/hooks/usePost";
import PostCard from "../../../components/main-card";
import PostCardSkeleton from "./main-card-skeleton";

const Page = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = usePosts();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.data) || [];
  
  if (!posts) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <GridTwoWrapper>
        <div className="lg:col-span-2 max-w-4xl mx-auto py-10">
          <div className="mt-0 w-full">
            <h1 className="sr-only">Recent questions</h1>
            <div className="mx-auto space-y-5 w-full">
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  postImg={post.image}
                  profileImg={post.user_info.profile}
                  description={post.description}
                  created_at={post.created_at}
                  username={post.user_info.name}
                  userId={post.user_info._id}
                  postId={post._id}
                  isLicense={post.pilot_info.ia_DGCA_license}
                />
              ))}

              {/* Message when there are no more posts */}
              {!hasNextPage && (
                <p className="text-center text-gray-500">
                  No more posts to load.
                </p>
              )}
              {isFetchingNextPage &&
                Array.from({ length: 5 }).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))}
              {hasNextPage && !isFetchingNextPage && (
                <div ref={ref}>Scroll to load more</div>
              )}
            </div>
          </div>
        </div>

        <RightSidebar />
      </GridTwoWrapper>
    </>
  );
};

export default Page;
