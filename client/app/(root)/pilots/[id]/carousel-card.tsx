"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PostCard from "@/components/main-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface RootObject {
  _id: string;
  description: string;
  image: string;
  created_at: string;
  username: string;
  userId: string;
  profileImage: string;
}

export default function CarouselCard({
  data,
  id,
  username,
  userId,
  profileImage,
  isLicense,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  id: string;
  username: string;
  userId: string;
  profileImage: string;
  isLicense: boolean | null;
}) {
  console.log(userId);

  return (
    <div className="mx-10">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {data?.map((post: RootObject) => (
            <CarouselItem key={post._id} className="md:basis-1/2 lg:basis-1/2">
              <PostCard
                created_at={post?.created_at}
                description={post?.description}
                postImg={post?.image}
                profileImg={profileImage}
                username={username}
                userId={userId}
                postId={post?._id}
                isLicense={isLicense}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="" />
        <CarouselNext className="" />
      </Carousel>
      <Button variant={"outline"} className="w-full mt-5" asChild>
        <Link href={`/pilots/${id}/posts`}>See all posts</Link>
      </Button>
    </div>
  );
}
