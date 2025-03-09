"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import userStore from "@/store/userStore";
// import { buttonVariants } from "@/components/bu"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    user: string[];
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = userStore();
  return (
    <nav className={cn("flex  overflow-x-scroll", className)} {...props}>
      {items.map(
        (item) =>
          item.user.includes(user.user_type!) && (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "border-b-2 border-black"
                  : "hover:bg-transparent hover:underline",
                "justify-start px-4 py-2"
              )}
            >
              {item.title}
            </Link>
          )
      )}
    </nav>
  );
}
