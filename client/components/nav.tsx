"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {  
  Building2, 
  Calendar1Icon, 
  LucideIcon, 
  Newspaper, 
  Settings, 
  User2Icon, 
  ClipboardList 
} from "lucide-react";
import { usePathname } from "next/navigation";
import userStore from "@/store/userStore";

interface NavLinkProps {
  isActive: boolean;
  href: string;
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  isActive,
  href,
  icon: Icon,
  text,
  onClick,
}) => {
  return (
    <Link
      className={clsx(
        "inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 justify-start",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white":
            isActive,
          "hover:bg-accent hover:text-accent-foreground": !isActive,
        }
      )}
      href={href}
      onClick={onClick} // Close sidebar on click
    >
      <Icon className="lucide lucide-file mr-2 h-4 w-4" />
      {text}
    </Link>
  );
};

const Nav = ({ onNavClick }: { onNavClick?: () => void }) => {
  const pathname = usePathname();
  const { user } = userStore(); // ✅ Get user details from store

  const role = user?.user_type || "guest"; // Default to "guest" if no role is found
  
  // ✅ Define role-based navigation with different paths
  const RoleBasedNavItems: Record<string, Array<{ id: number; route: string; pathname: string; icon: LucideIcon }>> = {
    a: [
      { id: 1, route: "/blog", pathname: "Blog", icon: Newspaper },
      { id: 2, route: "/event", pathname: "Events", icon: Calendar1Icon },
      { id: 3, route: "/pilots", pathname: "Pilots", icon: User2Icon },
      { id: 4, route: "/company", pathname: "Company", icon: Building2 },
      { id: 5, route: "/admin", pathname: "Verification", icon: Building2 },
      { id: 6, route: "/setting", pathname: "Settings", icon: Settings },

      // { id: 6, route: "/admin/bookings", pathname: "Bookings", icon: ClipboardList },
      // { id: 7, route: "/admin/settings", pathname: "Settings", icon: Settings },
    ],
    c: [
      { id: 1, route: "/blog", pathname: "Blog", icon: Newspaper },
      { id: 2, route: "/event", pathname: "Events", icon: Calendar1Icon },
      { id: 3, route: "/pilots", pathname: "Pilots", icon: User2Icon },
      { id: 4, route: "/company", pathname: "Company", icon: Building2 },
      { id: 5, route: "/bookings/customer", pathname: "Bookings", icon: ClipboardList },
      { id: 6, route: "/setting", pathname: "Settings", icon: Settings },
    ],
    p: [
      { id: 1, route: "/blog", pathname: "Blog", icon: Newspaper },
      { id: 2, route: "/event", pathname: "Events", icon: Calendar1Icon },
      { id: 3, route: "/bookings/pilot", pathname: "Bookings", icon: ClipboardList },
      { id: 4, route: "/setting", pathname: "Settings", icon: Settings },
    ],
    o: [
      { id: 1, route: "/blog", pathname: "Blog", icon: Newspaper },
      { id: 2, route: "/event", pathname: "Events", icon: Calendar1Icon },
      { id: 3, route: "/company/pilots", pathname: "Pilots", icon: User2Icon },
      { id: 4, route: "/bookings/company", pathname: "Bookings", icon: ClipboardList },
      { id: 5, route: "/setting", pathname: "Settings", icon: Settings },
    ],
    guest: [], // No navigation for guests
  };

  // ✅ Get the correct navigation based on user role
  const NavItems = RoleBasedNavItems[role] || [];  
  return (
    <nav className="grid gap-1 sticky top-20">
      {NavItems.map((item) => (
        <NavLink
          key={item.id}
          href={item.route}
          text={item.pathname}
          isActive={pathname.startsWith(item.route)}
          icon={item.icon}
          onClick={onNavClick}
        />
      ))}
    </nav>
  );
};

export default Nav;
