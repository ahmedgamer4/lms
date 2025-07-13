"use client";

import Link from "next/link";
import React, { useTransition } from "react";
import { SignupForm } from "./signup-form";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const { subdomain } = useParams();

  const t = useTranslations();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-primary text-primary-foreground hidden min-h-screen w-1/2 flex-col justify-between p-12 md:flex">
        <h3 className="text-2xl font-bold">{t("signup.title")}</h3>
        <p className="text-muted w-4/5">{t("signup.description")}</p>
      </div>
      <div className="flex w-10/12 justify-center md:w-1/2">
        <div className="w-80">
          <h1 className="mb-4 text-center text-2xl font-bold">
            {t("signup.title")}
          </h1>
          <SignupForm subdomain={subdomain as string} />
          <div className="mt-2 flex justify-between text-sm">
            <p>{t("signup.alreadyHaveAccount")}</p>
            <Link className="underline" href={"/login"}>
              {t("signup.signIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
