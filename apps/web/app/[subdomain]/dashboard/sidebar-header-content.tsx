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
import { ChartBar, Book, Settings, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarHeaderContent() {
  const t = useTranslations("sidebar");
  const path = usePathname();
  return (
    <>
      <SidebarHeader className="mt-3 ml-3 text-xl font-bold">
        <div className="flex items-center justify-between pr-3">
          <div className="flex items-center">
            <GraduationCap size={50} className="mr-2 flex flex-col" />
            {t("platform")}
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
                  <Book className="h-5 w-5 opacity-90" />
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
                  <ChartBar className="h-5 w-5 opacity-90" />
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
                  <Settings className="h-5 w-5 opacity-90" />
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
