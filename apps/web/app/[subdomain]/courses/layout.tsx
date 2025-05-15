import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Topbar } from "./topbar";

export default async function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== "student")
    redirect("/login");

  return (
    <div>
      <Topbar />
      <div className="mx-auto">{children}</div>
    </div>
  );
}
