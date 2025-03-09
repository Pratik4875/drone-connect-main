"use client";
import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  Building,
  EllipsisVertical,
  Edit2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import userStore from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteEvent from "@/app/(root)/event/delete-event";
interface EventCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  start_time: string;
  end_time: string;
  company_name: string;
  company_id: string;
  register_link: string;
  eventId: string;
}
const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dcv9bhbly/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
export default function EventCard({
  title,
  description,
  date,
  imageUrl,
  street,
  city,
  state,
  pincode,
  start_time,
  end_time,
  company_name,
  company_id,
  register_link,
  eventId,
}: EventCardProps) {
  const { user, isAuthenticated } = userStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCurrentUser = isAuthenticated && company_id === user.company_id;
  console.log(isCurrentUser);

  const truncatedDescription =
    description.slice(0, 200) + (description.length > 200 ? "..." : "");

  return (
    <Card className="w-[34rem] max-w-full mx-auto overflow-hidden group">
      <div className="relative h-80 overflow-hidden">
        <Image
          src={`${CLOUDINARY_BASE_URL}${imageUrl}`}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-10">
          {isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="ml-auto">
                <Button variant="outline" size="icon">
                  <EllipsisVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuItem asChild>
                  <Link href={`/event/edit/${eventId}`}>
                    <Edit2 />
                    <span>Edit</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onSelect={(event) => event.preventDefault()}
                >
                  <DeleteEvent id={eventId} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <div className="flex items-center text-white/80">
            <MapPin className=" mr-2 size-6" />
            <span className="text-sm">
              {street}, {city}, {state}, {pincode}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 w-full max-w-full">
            {isExpanded ? description : truncatedDescription}
          </p>
          {description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:underline mt-1"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "View less" : "View more"}
            </button>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{format(new Date(date), "MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(start_time), "hh:mm a")} -{" "}
            {format(new Date(end_time), "hh:mm a")}
          </span>
        </div>
        <Link
          className="flex items-center text-sm text-gray-500"
          href={`/company/${company_id}`}
        >
          <Building className="w-4 h-4 mr-2" />
          <span className="underline">{company_name}</span>
        </Link>
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Button className="w-full group" asChild>
          <Link href={register_link} target="_blank">
            Register
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
