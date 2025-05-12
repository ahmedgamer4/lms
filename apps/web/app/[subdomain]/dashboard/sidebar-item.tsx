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
          <SidebarMenuButton
            className={
              item.url === path
                ? `text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary`
                : `hover:text-primary/90 hover:bg-accent`
            }
            asChild
          >
            <Link replace={true} href={item.url}>
              <item.icon className="h-5 w-5 opacity-90" />
              <span className="text-md">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
