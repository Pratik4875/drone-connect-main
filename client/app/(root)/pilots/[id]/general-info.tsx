import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useSocial } from "@/hooks/useSocial";
import userStore from "@/store/userStore";
import AvatarProfile from "@/components/Avatar";
import { VscVerifiedFilled } from "react-icons/vsc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BookPilot from "./book-pilot";
interface RootObject {
  platform: string;
  account: string;
}

const GeneralInfo = ({
  username,
  city,
  state,
  droneCategory,
  socials,
  userId,
  profileImage,
  isAvailable,
  pilot_id,
  isCompanyPerson,
  isLicense,
}: {
  username: string;
  city: string;
  state: string;
  droneCategory: string;
  socials: RootObject[];
  userId: string;
  profileImage: string;
  isAvailable: boolean;
  pilot_id: string;
  isCompanyPerson: boolean;
  isLicense: boolean | null;
}) => {
  const { user, isAuthenticated } = userStore();

  const { socialAccounts } = useSocial();
  return (
    <Card className="overflow-hidden">
      {/* Header Background */}
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-red-400 to-pink-500 text-white" />

        {/* Profile Section */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative -mt-20 mb-4">
            <div className="relative flex justify-between items-end">
              <AvatarProfile
                className="md:size-40 size-32"
                src={
                  profileImage
                    ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${profileImage}`
                    : ""
                } // Display file URL if file selected, else fallback to default src
                fallbackClassName="text-3xl"
                fallbackText={username}
              />
              {isAuthenticated && user?._id === userId && (
                <div className="flex items-center gap-2">
                  <Link href="/setting">
                    <FiEdit2 className="text-2xl" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold flex items-center">
                  {username}{" "}
                  {isLicense && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <VscVerifiedFilled className="ml-2 text-green-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified License</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </h1>
                <p className="text-zinc-400 capitalize">
                  {droneCategory} size drone
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                  <span>
                    {city}, {state}
                  </span>
                  <span>·</span>
                </div>
              </div>
              {isAuthenticated &&
                user?._id !== userId &&
                isAvailable &&
                !isCompanyPerson && (
                  <BookPilot pilot_id={pilot_id} company_id={null} />
                )}
            </div>
            <div className="bg-white w-full h-auto py-3 flex items-center justify-center gap-4 flex-wrap">
              {socials.map((social, index) => {
                const socialData = socialAccounts.find(
                  (item) =>
                    item.social.toLowerCase() === social.platform.toLowerCase()
                );
                if (!socialData) return null;
                const { icon: Icon, url } = socialData;
                const profileUrl = `${url}${social.account}`;

                return (
                  <Link href={profileUrl} target="_blank" key={index}>
                    {Icon}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfo;
