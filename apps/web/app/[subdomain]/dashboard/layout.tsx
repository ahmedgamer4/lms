import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { Book, ChartBar, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { SidebarItems } from "./sidebar-item";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  console.log(session);
  if (!session || !session.user) redirect("/login-teacher");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarTrigger />
        <Sidebar>
          <SidebarHeader className="ml-3 mt-3 text-xl font-bold">
            {session.user.name[0]?.toUpperCase() +
              session.user.name.substring(1)}{" "}
            Platform
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
        <div className="w-full py-2">{children}</div>
      </div>
    </SidebarProvider>
  );
}
