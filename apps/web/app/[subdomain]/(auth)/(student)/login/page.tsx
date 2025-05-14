"use client";

import Link from "next/link";
import React from "react";
import { LoginForm } from "../../login-form";
import { useParams } from "next/navigation";

export default function StudentLoginPage() {
  const { subdomain } = useParams();
  return (
    <div className="flex w-96 flex-col items-center justify-center rounded-lg border bg-white p-6 shadow-sm">
      <div className="w-full">
        <h1 className="mb-1 text-2xl font-bold">Login</h1>
        <p className="mb-4 text-sm text-gray-700">
          Enter your email below to login to your account
        </p>
        <LoginForm subdomain={subdomain as string} role="student" />
        <div className="mt-4 flex justify-between text-sm">
          <p>Don't have an account?</p>
          <Link className="underline" href={"/signup"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
