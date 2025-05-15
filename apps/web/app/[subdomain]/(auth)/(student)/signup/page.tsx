"use client";

import Link from "next/link";
import React from "react";
import { SignupForm } from "./signup-form";
import { useParams } from "next/navigation";

export default async function SignupPage() {
  const { subdomain } = useParams();
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-primary text-primary-foreground hidden min-h-screen w-1/2 flex-col justify-between p-12 md:flex">
        <h3 className="text-2xl font-bold">Next LMS</h3>
        <p className="text-muted w-4/5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellat nostrum tenetur maxime earum possimus placeat consequatur
          dolorum voluptate explicabo? Unde deleniti amet tempore alias nobis
          similique cupiditate sint error.
        </p>
      </div>
      <div className="flex w-10/12 justify-center md:w-1/2">
        <div className="w-80">
          <h1 className="mb-4 text-center text-2xl font-bold">Sign In Page</h1>
          <SignupForm subdomain={subdomain as string} />
          <div className="mt-2 flex justify-between text-sm">
            <p>Already have an account?</p>
            <Link className="underline" href={"/login"}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
