"use client";

import React, { PropsWithChildren } from "react";
import "reflect-metadata";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
