"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideIcon, MenuIcon, PlusIcon } from "lucide-react";
import Nav from "./nav";
import {
  LogOut,
  User,
  Key,
  Briefcase,
  Users,
  Award,
  Building,
  ClipboardList,
  CalendarClock,
  CalendarCheck2,
  CalendarX,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import userStore from "@/store/userStore";
import Link from "next/link";
import AvatarProfile from "./Avatar";
import { useRouter } from "next/navigation";
const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dmuhioahv/image/upload/c_pad,ar_4:3,w_1600,h_1195,b_auto/v1736958453/";
const RoleBasedNavItems: Record<
  string,
  Array<{ id: number; route: string; pathname: string; icon: LucideIcon }>
> = {
  c: [
    { id: 1, route: "/setting", pathname: "Profile", icon: User },
    { id: 2, route: "/setting/password", pathname: "Password", icon: Key },
    {
      id: 3,
      route: "/bookings/customer?tab=pending",
      pathname: "Booking Pending",
      icon: CalendarClock,
    },
    {
      id: 4,
      route: "/bookings/customer?tab=confirmed",
      pathname: "Booking Confirmed",
      icon: CalendarCheck2,
    },
    {
      id: 6,
      route: "/bookings/customer?tab=rejected",
      pathname: "Booking Cancelled",
      icon: CalendarX,
    },
    {
      id: 7,
      route: "/bookings/customer?tab=completed",
      pathname: "Booking Completed",
      icon: CalendarCheck,
    },
  ],

  p: [
    { id: 1, route: "/setting", pathname: "Profile", icon: User },
    {
      id: 2,
      route: "/setting/password",
      pathname: "Professional",
      icon: Briefcase,
    },
    { id: 3, route: "/setting/password", pathname: "Social", icon: Users },
    {
      id: 4,
      route: "/setting/password",
      pathname: "Experience",
      icon: ClipboardList,
    },
    {
      id: 5,
      route: "/setting/password",
      pathname: "Certification",
      icon: Award,
    },
    {
      id: 6,
      route: "/bookings/pilot?tab=pending",
      pathname: "Booking Pending",
      icon: CalendarClock,
    },
    {
      id: 7,
      route: "/bookings/pilot?tab=confirmed",
      pathname: "Booking Confirmed",
      icon: CalendarCheck2,
    },
    {
      id: 8,
      route: "/bookings/pilot?tab=rejected",
      pathname: "Booking Cancelled",
      icon: CalendarX,
    },
    {
      id: 9,
      route: "/bookings/pilot?tab=completed",
      pathname: "Booking Completed",
      icon: CalendarCheck,
    },
  ],
  o: [
    { id: 1, route: "/setting", pathname: "Profile", icon: User },
    { id: 2, route: "/setting/password", pathname: "Password", icon: Key },
    { id: 3, route: "/setting/company", pathname: "Company", icon: Building },
    {
      id: 4,
      route: "/bookings/company?tab=pending",
      pathname: "Booking Pending",
      icon: CalendarClock,
    },
    {
      id: 5,
      route: "/bookings/company?tab=confirmed",
      pathname: "Booking Confirmed",
      icon: CalendarCheck2,
    },
    {
      id: 6,
      route: "/bookings/company?tab=rejected",
      pathname: "Booking Cancelled",
      icon: CalendarX,
    },
    {
      id: 7,
      route: "/bookings/company?tab=completed",
      pathname: "Booking Completed",
      icon: CalendarCheck,
    },
  ],
  guest: [], // No navigation for guests
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, user, isAuthenticated } = userStore();
  const { handleLogout } = useLogout(logout);
  const role = user?.user_type || "guest"; // Default to "guest" if no role is found

  const DropDownItems = RoleBasedNavItems[role] || [];
  const router = useRouter();

  return (
    <header className=" lg:static lg:overflow-y-visible">
      <div className="left-0 right-0 bg-white shadow-sm z-20 top-0 max-w-full px-4 sm:px-6 lg:px-8  h-16 fixed">
        <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12 my-auto h-full">
          <div className="flex items-center md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
            <div className="lg:hidden mr-3">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                  <MenuIcon />
                </SheetTrigger>
                <SheetContent side={"left"}>
                  <SheetHeader>
                    <SheetDescription className="pt-10">
                      <Nav onNavClick={() => setIsOpen(false)} />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <Image
                  className="block h-8 w-auto"
                  src={"/drone-connet.png"}
                  alt="Your Company"
                  width={200}
                  height={200}
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center md:absolute md:inset-y-0 md:right-0 gap-3">
            {isAuthenticated ? (
              <>
                {/* Create Button */}
                {user?.user_type !== "c" && (
                  <Button
                    variant="default"
                    className="bg-rose-600 rounded-full"
                  >
                    <Link
                      href={
                        user?.user_type === "p"
                          ? "/blog/create"
                          : user?.user_type === "o"
                          ? "/event/create"
                          : "/"
                      }
                      className="flex items-center gap-1"
                    >
                      <PlusIcon />{" "}
                      <span className="hidden md:block">Create</span>
                    </Link>
                  </Button>
                )}

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <AvatarProfile
                      className="md:size-8 size-8 mx-auto "
                      src={
                        user?.profile
                          ? ` ${CLOUDINARY_BASE_URL}${user?.profile}`
                          : ""
                      } // Display file URL if file selected, else fallback to default src
                      fallbackClassName="text-sm"
                      fallbackText={user?.name}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Account Actions */}
                    <DropdownMenuGroup>
                      {DropDownItems?.map((item) => (
                        <DropdownMenuItem
                          key={item?.id}
                          onClick={() => {
                            router.push(item?.route);
                          }}
                        >
                          {React.createElement(item?.icon)}{" "}
                          {/* Fix: Instantiate the icon */}
                          <span>{item?.pathname}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Register and Login Buttons */}
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          <div className="lg:flex lg:items-center lg:justify-end xl:col-span-4 hidden"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
