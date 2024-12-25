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
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

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

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  if (!session || !session.user) redirect("/login-teacher");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarTrigger />
        <Sidebar>
          <SidebarHeader className="font-bold text-xl mt-6 ml-3">
            {session.user.name[0]?.toUpperCase() +
              session.user.name.substring(1)}{" "}
            Platform
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Items</SidebarGroupLabel>
              <SidebarGroupContent>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="list-none ">
                    <SidebarMenuButton asChild>
                      <Link replace={true} href={item.url}>
                        <item.icon />
                        <span className="font-semibold text-md">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="py-8 w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
