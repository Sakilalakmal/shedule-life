"use client";

import { cn } from "@/lib/utils";
import {
  CalendarCheck2,
  HomeIcon,
  LucideProps,
  Settings,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface dashBoardLinkProps {
  id: number;
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const dashBoardLinks: dashBoardLinkProps[] = [
  {
    id: 1,
    href: "/dashboard",
    icon: HomeIcon,
    name: "Event Types",
  },
  {
    id: 2,
    href: "/dashboard/meetings",
    icon: Users2Icon,
    name: "Meetings",
  },
  {
    id: 3,
    href: "/dashboard/availability",
    icon: CalendarCheck2,
    name: "Availability",
  },
  {
    id: 4,
    href: "/dashboard/setting",
    icon: Settings,
    name: "Setting",
  },
];

export function DashboardLinks() {
  const pathName = usePathname();

  return (
    <>
      {dashBoardLinks.map((link) => (
        <Link
          className={cn(
            pathName === link.href
              ? " bg-primary/20"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary mt-4"
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
