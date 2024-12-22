import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  if (!session || !session.user) redirect("/login-teacher");
  return <>{children}</>;
}
