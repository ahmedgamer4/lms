"use client";

import { ModeToggle } from "@/components/mode-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IconChartBar, IconBook, IconSettings } from "@tabler/icons-react";

export default function SidebarHeaderContent() {
  const t = useTranslations("sidebar");
  const path = usePathname();
  return (
    <>
      <SidebarHeader className="text-xl font-bold">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="dark:invert"
              src="/logo.png"
              alt="logo"
              width={50}
              height={30}
            />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("items")}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenuItem className="list-none">
              <SidebarMenuButton
                className={
                  path.includes("/dashboard/courses")
                    ? `text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary`
                    : `hover:text-primary/90 hover:bg-accent`
                }
                asChild
              >
                <Link replace={true} href="/dashboard/courses">
                  <IconBook className="h-5 w-5 opacity-90" />
                  <span className="text-md">{t("courses")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="list-none">
              <SidebarMenuButton
                className={
                  path.includes("/dashboard/analytics")
                    ? `text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary`
                    : `hover:text-primary/90 hover:bg-accent`
                }
                asChild
              >
                <Link replace={true} href="/dashboard/analytics">
                  <IconChartBar className="h-5 w-5 opacity-90" />
                  <span className="text-md">{t("analytics")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="list-none">
              <SidebarMenuButton
                className={
                  path.includes("/dashboard/settings")
                    ? `text-primary-foreground hover:text-primary-foreground bg-primary hover:bg-primary`
                    : `hover:text-primary/90 hover:bg-accent`
                }
                asChild
              >
                <Link replace={true} href="/dashboard/settings">
                  <IconSettings size={20} className="opacity-90" />
                  <span className="text-md">{t("settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
