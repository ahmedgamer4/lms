"use client";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Book, ChartBar, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: Book,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartBar,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const SidebarItems = () => {
  const path = usePathname();
  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className="list-none">
          <SidebarMenuButton asChild>
            <Link
              className={
                item.url === path
                  ? `bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground`
                  : ``
              }
              replace={true}
              href={item.url}
            >
              <item.icon />
              <span className="text-md font-semibold">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
