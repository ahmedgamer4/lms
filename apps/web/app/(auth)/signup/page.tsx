import Link from "next/link";
import React from "react";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="flex w-full items-center bg-white">
      <div className="bg-foreground flex min-h-screen w-1/2 flex-col justify-between p-12 text-white">
        <h3 className="text-2xl font-bold">Next LMS</h3>
        <p className="w-4/5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellat nostrum tenetur maxime earum possimus placeat consequatur
          dolorum voluptate explicabo? Unde deleniti amet tempore alias nobis
          similique cupiditate sint error.
        </p>
      </div>
      <div className="flex w-1/2 justify-center bg-white">
        <div className="w-80">
          <h1 className="mb-4 text-center text-2xl font-bold">Sign In Page</h1>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
