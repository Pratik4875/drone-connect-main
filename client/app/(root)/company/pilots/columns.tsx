"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarProfile from "@/components/Avatar";
import Link from "next/link";
import DeletePilot from "./delete-pilot";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface RootObject {
  name: string;
  user_id: string;
  drone_category: string;
  profile: string;
  email: string;
}
export const columns: ColumnDef<RootObject>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const info = row.original;
      return (
        <div className="flex items-center cursor-pointer w-max">
          {/* <img
            src="https://readymadeui.com/profile_4.webp"
            className="w-9 h-9 rounded-full shrink-0"
          /> */}
          <AvatarProfile
            className="md:size-9 size-9"
            src={
              info.profile
                ? `https://res.cloudinary.com/dcv9bhbly/image/upload/v1736958453/${info.profile}`
                : ""
            } // Display file URL if file selected, else fallback to default src
            fallbackClassName="text-xl"
            fallbackText={info.name}
          />
          <div className="ml-4">
            <p className="text-sm text-black capitalize">{info.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{info.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const info = row.original;

      return <p className="capitalize">{info.drone_category}</p>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const info = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/pilots/${info.user_id}`}>
                <Plus />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <DeletePilot id={info.user_id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
