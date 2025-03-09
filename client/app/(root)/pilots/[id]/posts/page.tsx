"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useInView } from "react-intersection-observer";
import { GridOneWrapper } from "@/components/GridOneWarpper";
import PostCardSkeleton from "@/app/(root)/blog/main-card-skeleton";
import PostCard from "@/components/main-card";
import { usePostsUser } from "@/hooks/usePostUser";
const Page = () => {
  const { id } = useParams<{ id: string }>(); // Correct TypeScript typing
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = usePostsUser(id);
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.data) || [];

  if (isError) {
    return <div>Error soemthing went wrong : {error.message}</div>;
  }
  return (
    <>
      <GridOneWrapper>
        <div className="lg:col-span-2 max-w-4xl mx-auto py-10">
          <div className="mt-0 w-full bg-slate-100 rounded-md p-2">
            <h1 className="font-bold text-3xl p-5">All Post</h1>
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
                  isLicense={null}
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
      </GridOneWrapper>
    </>
  );
};

export default Page;
