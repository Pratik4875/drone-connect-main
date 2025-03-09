"use client";
import { EllipsisVertical, Edit2 } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import AvatarProfile from "@/components/Avatar";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import userStore from "@/store/userStore";
import Link from "next/link";
import DeletePost from "@/app/(root)/blog/delete-post";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { VscVerifiedFilled } from "react-icons/vsc";
interface PostCardProps {
  postImg: string;
  profileImg: string | null;
  description: string;
  created_at: string;
  username: string;
  userId: string;
  postId: string;
  isLicense: boolean | null;
}

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dcv9bhbly/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";

const PostCard: FC<PostCardProps> = ({
  postImg,
  profileImg,
  description,
  created_at,
  username,
  userId,
  postId,
  isLicense,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = userStore();
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });
  const isCurrentUser = isAuthenticated && userId === user._id;
  const shouldTruncate = description.length > 150;
  const displayText =
    isExpanded || !shouldTruncate
      ? description
      : `${description.slice(0, 150)}...`;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <CardHeader className="flex flex-row items-center gap-4">
        <AvatarProfile
          className="md:size-12 size-12"
          src={profileImg ? `${CLOUDINARY_BASE_URL}${profileImg}` : ""}
          fallbackClassName="text-3xl"
          fallbackText={username}
        />
        <div>
          <Link href={`/pilots/${userId}`}>
            <h3 className="font-semibold flex items-center">
              {username}{" "}
              {isLicense && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <VscVerifiedFilled className="ml-2 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Verified License</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">Posted {formattedDate}</p>
        </div>
        {isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
              <button type="button">
                <EllipsisVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
              <DropdownMenuItem asChild>
                <Link href={`/blog/edit/${postId}`}>
                  <Edit2 />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onSelect={(event) => event.preventDefault()}
              >
                <DeletePost id={postId} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {/* Content Section */}
      <CardContent className="space-y-4">
        <div>
          <p>{displayText}</p>
          {shouldTruncate && !isExpanded && (
            <Button
              variant="link"
              onClick={() => setIsExpanded(true)}
              className="p-0 h-auto font-bold underline"
            >
              View more
            </Button>
          )}
        </div>

        {/* Post Image */}
        <Image
          src={`${CLOUDINARY_BASE_URL}${postImg}`}
          alt="Post Image"
          className="object-cover object-center w-full rounded-xl aspect-3/4"
          width={600}
          height={450}
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw..."
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;
