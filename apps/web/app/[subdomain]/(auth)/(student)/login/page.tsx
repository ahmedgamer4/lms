"use client";

import Link from "next/link";
import React from "react";
import { LoginForm } from "../../login-form";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function StudentLoginPage() {
  const { subdomain } = useParams();
  const t = useTranslations();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/logo.png"
          className="dark:invert"
          alt="logo"
          width={40}
          height={40}
        />
        <h1 className="font-bold">{t("metadata.platformName")}.</h1>
      </div>
      <div className="flex w-96 flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
        <div className="w-full">
          <h1 className="mb-1 text-2xl font-bold">{t("login.title")}</h1>
          <p className="text-muted-foreground mb-4 text-sm">
            {t("login.description")}
          </p>
          <LoginForm subdomain={subdomain as string} role="student" />
          <div className="mt-4 flex justify-between text-sm">
            <p>{t("login.dontHaveAccount")}</p>
            <Link className="underline" href={"/signup"}>
              {t("login.signUp")}
            </Link>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground w-64 text-center text-sm">
        {t("auth.agreeTo")}{" "}
        <Link className="underline" href={"/terms"}>
          {t("auth.termsOfService")}
        </Link>{" "}
        {t("auth.and")}{" "}
        <Link className="underline" href={"/privacy"}>
          {t("auth.privacyPolicy")}
        </Link>
      </p>
    </div>
  );
}
