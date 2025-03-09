import AvatarProfile from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CompanyPilotCard = ({
  profileImage,
  name,
  category,
  user_id,
}: {
  profileImage: string;
  name: string;
  category: string;
  user_id: string;
}) => {
  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <AvatarProfile
          className="md:size-14 size-12"
          src={
            profileImage
              ? `https://res.cloudinary.com/dmuhioahv/image/upload/v1736958453/${profileImage}`
              : ""
          } // Display file URL if file selected, else fallback to default src
          fallbackClassName="md:text-2xl text-lg"
          fallbackText={name}
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm/6 font-semibold text-gray-900">{name}</p>
          <p className="truncate text-xs/5 text-gray-500 capitalize">
            {category} Drones
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        {/* <p className="text-sm/6 text-gray-900">{person.role}</p> */}
        <Button variant={"outline"} size={"icon"} asChild>
          <Link href={`/pilots/${user_id}`}>
            <MoveUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </li>
  );
};

export default CompanyPilotCard;
