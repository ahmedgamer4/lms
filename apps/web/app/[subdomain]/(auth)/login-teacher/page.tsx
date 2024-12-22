import Link from "next/link";
import React from "react";
import { TeacherLoginForm } from "./login-form";

export default function TeacherLoginPage() {
  return (
    <div className="bg-white p-6 rounded-lg border border-1 shadow-sm w-96 flex flex-col justify-center items-center ">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-1">Login</h1>
        <p className="text-sm mb-4 text-gray-700">
          Enter your email below to login to your account
        </p>
        <TeacherLoginForm />
        {/* <div className="flex justify-between text-sm mt-4">
          <p>Don't have an account?</p>
          <Link className="underline" href={"/signup"}>
            Sign Up
          </Link>
        </div> */}
      </div>
    </div>
  );
}
