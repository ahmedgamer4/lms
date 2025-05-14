"use client";

import React from "react";
import { LoginForm } from "../login-form";
import { useParams } from "next/navigation";

export default function TeacherLoginPage() {
  const { subdomain } = useParams();
  return (
    <div className="flex w-96 flex-col items-center justify-center rounded-lg border-1 p-6 shadow-sm">
      <div className="w-full">
        <h1 className="mb-1 text-2xl font-bold">Login</h1>
        <p className="text-muted-foreground mb-4 text-sm">
          Enter your email below to login to your account
        </p>
        <LoginForm subdomain={subdomain as string} role="teacher" />
      </div>
    </div>
  );
}
