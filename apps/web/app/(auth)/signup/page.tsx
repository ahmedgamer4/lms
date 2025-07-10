import React from "react";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="bg-background flex w-full items-center">
      <div className="bg-primary text-primary-foreground hidden min-h-screen w-1/2 flex-col justify-between p-12 md:flex">
        <h3 className="text-2xl font-bold">Next LMS</h3>
        <p className="w-4/5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellat nostrum tenetur maxime earum possimus placeat consequatur
          dolorum voluptate explicabo? Unde deleniti amet tempore alias nobis
          similique cupiditate sint error.
        </p>
      </div>
      <div className="bg-background flex w-1/2 justify-center">
        <div className="w-80">
          <h1 className="mb-4 text-center text-2xl font-bold">Sign In Page</h1>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
