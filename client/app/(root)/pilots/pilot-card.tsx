import AvatarProfile from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GiDeliveryDrone } from "react-icons/gi";
import { VscVerifiedFilled } from "react-icons/vsc";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dcv9bhbly/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
const PilotCard = ({
  name,
  profile,
  id,
  state,
  city,
  category,
  isLicense,
  rating
}: {
  name: string;
  profile: string;
  id: string;
  state: string;
  city: string;
  category: string;
  isLicense:boolean;
  rating:number
}) => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none overflow-hidden group">
      <div className="relative">
        <AvatarProfile
          className="md:size-40 size-48 mx-auto "
          src={
            profile ?` ${CLOUDINARY_BASE_URL}${profile}` : ""
          } // Display file URL if file selected, else fallback to default src
          fallbackClassName="text-3xl"
          fallbackText={name}
        />
        <div className="absolute flex items-center top-0 right-0 bg-white m-2 px-2 py-1 rounded-full text-sm font-semibold text-blue-600 shadow">
          <Star className="w-5 h-5 mr-1 fill-current" />
          <span>{rating}</span>
        </div>
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="text-xl flex justify-center items-center font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {name}
          {isLicense && <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <VscVerifiedFilled className="ml-2 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Verified License</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
        </h3>
        <div className="flex items-center justify-center mb-2 text-gray-600">
          <MapPin className="w-5 h-5 mr-1" />
          <span>
            {city}, {state}
          </span>
        </div>
        <div className="flex items-center justify-center mb-2 text-gray-600">
          <GiDeliveryDrone className="w-5 h-5 mr-1" />
          <span className="capitalize">{category} Size</span>
        </div>
        {/* <div className="flex items-center mb-4 text-gray-600">
        <DollarSign className="w-5 h-5 mr-1" />
        <span>{pilot.experience} years experience</span>
      </div> */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          asChild
        >
          <Link href={`/pilots/${id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PilotCard;
