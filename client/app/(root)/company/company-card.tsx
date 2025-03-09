import AvatarProfile from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dmuhioahv/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
const CompanyCard = ({
  name,
  profile,
  id,
}: {
  name: string;
  profile: string;
  id: string;
}) => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none overflow-hidden group">
      <div className="relative">
        <AvatarProfile
          className="md:size-40 size-48 mx-auto "
          src={profile ? ` ${CLOUDINARY_BASE_URL}${profile}` : ""} // Display file URL if file selected, else fallback to default src
          fallbackClassName="text-3xl"
          fallbackText={name}
        />
        {/* <div className="absolute flex items-center top-0 right-0 bg-white m-2 px-2 py-1 rounded-full text-sm font-semibold text-blue-600 shadow">
          <Star className="w-5 h-5 mr-1 fill-current" />
          <span>3.2</span>
        </div> */}
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="text-xl flex justify-center items-center font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {name}
        </h3>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          asChild
        >
          <Link href={`/company/${id}`}>View Comapny Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
