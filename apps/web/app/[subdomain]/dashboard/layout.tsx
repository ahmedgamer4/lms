import {
  Sidebar,
  SidebarContent,
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

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  console.log(session);
  if (!session || !session.user || session.user.role !== "teacher")
    redirect("/login-teacher");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="mt-3 ml-3 text-xl font-bold">
            <div className="flex items-center">
              <GraduationCap size={24} className="mr-2 inline-block" />
              {session.user.name[0]?.toUpperCase() +
                session.user.name.substring(1)}{" "}
              Platform
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
        </Sidebar>
        <div className="w-full">
          <SidebarTrigger />
          <div className="w-full px-4 py-1">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
