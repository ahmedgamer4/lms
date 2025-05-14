import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { SidebarItems } from "./sidebar-item";
import { GraduationCap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { LowerSidebar } from "./courses/_components/lower-sidebar";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  console.log(session);
  if (!session || !session.user || session.user.role !== "teacher")
    redirect("/login-teacher");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="floating">
          <SidebarHeader className="mt-3 ml-3 text-xl font-bold">
            <div className="flex items-center justify-between pr-3">
              <div className="flex items-center">
                <GraduationCap size={50} className="mr-2 inline-block" />
                {session.user.name[0]?.toUpperCase() +
                  session.user.name.substring(1)}{" "}
                Platform
              </div>
              <ModeToggle />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Items</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarItems />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <LowerSidebar user={session.user} />
        </Sidebar>
        <div className="w-full">
          <SidebarTrigger className="mt-1" />
          <div className="w-full px-4 py-1">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
