import React from "react";
import { LoginForm } from "../login-form";

export default function TeacherLoginPage() {
  return (
    <div className="bg-white p-6 rounded-lg border border-1 shadow-sm w-96 flex flex-col justify-center items-center ">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-1">Login</h1>
        <p className="text-sm mb-4 text-gray-700">
          Enter your email below to login to your account
        </p>
        <LoginForm role="teacher" />
      </div>
    </div>
  );
}
