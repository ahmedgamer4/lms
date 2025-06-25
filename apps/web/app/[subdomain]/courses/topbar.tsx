"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { LogOut, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Topbar() {
  const params = useParams();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-background border-b">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{params.subdomain} Platform</h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user && (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">
                <LogOut className="h-5 w-5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
