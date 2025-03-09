import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  X,
  MessageCircle,
  Repeat2,
  Send,
  ThumbsUp,
  Github,
} from "lucide-react";
import Image from "next/image";

export default function Post() {
  return (
    <Card className="w-full max-w-2xl border-0 border-black text-white mx-auto">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-3">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12 rounded-full bg-white">
            <AvatarImage
              src="/placeholder.svg?height=48&width=48"
              alt="freeCodeCamp logo"
            />
            <AvatarFallback className="bg-white text-black">FCC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-black">freeCodeCamp</span>
              <span className="text-black">1,828,913 followers</span>
            </div>
            <div className="flex items-center gap-2 ">
              <span>40m</span>
              <span>·</span>
              <Github className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-black hover:text-white hover:bg-[#1d1f23] rounded-full h-8 w-8"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#71767b] hover:text-white hover:bg-[#1d1f23] rounded-full h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 space-y-3">
        <p className="text-black leading-normal text-[15px]">
          APIs let you fetch data from external sources to use in your
          applications. So as a web developer you&apos;ll need to know how to
          make API calls. In this tutorial, Joan shows you how to use the Fetch
          API, handle responses, work with API{" "}
          <button className="text-[#1d9bf0] hover:underline inline-flex items-center">
            ...more
          </button>
        </p>
        <Image
            src={
              "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="post-image"
            height={200}
            width={200}
            className="mx-auto h-full w-full"
          />
        
      </CardContent>
      <CardFooter className="p-1 flex flex-col gap-2">
        <div className="flex justify-between ">
          <Button
            variant="ghost"
            className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d1f23] flex-1"
          >
            <ThumbsUp className="h-[18px] w-[18px] mr-2" />
            Like
          </Button>
          <Button
            variant="ghost"
            className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d1f23] flex-1"
          >
            <MessageCircle className="h-[18px] w-[18px] mr-2" />
            Comment
          </Button>
          <Button
            variant="ghost"
            className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d1f23] flex-1"
          >
            <Repeat2 className="h-[18px] w-[18px] mr-2" />
            Repost
          </Button>
          <Button
            variant="ghost"
            className="text-[#71767b] hover:text-[#1d9bf0] hover:bg-[#1d1f23] flex-1"
          >
            <Send className="h-[18px] w-[18px] mr-2" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
