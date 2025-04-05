"use client";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

export const SidebarItem = ({ item }: { item: any }) => {
  const path = usePathname();
  return (
    <SidebarMenuItem key={item.title} className="list-none ">
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
          {/* <item.icon /> */}
          <span className="font-semibold text-md">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
