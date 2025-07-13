"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Input } from "@/components/ui/input";
import { LoginUserDto } from "@lms-saas/shared-lib/dtos";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoginForm({
  subdomain,
  role,
}: {
  subdomain: string;
  role: string;
}) {
  const router = useRouter();
  const t = useTranslations();

  const resolver = useMemo(() => {
    return classValidatorResolver(LoginUserDto);
  }, []);

  const form = useForm<LoginUserDto>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
      role,
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data: LoginUserDto) {
    data.subdomain = subdomain;
    const res = await loginUser(data);
    if (res?.status !== 200)
      form.setError("root", { message: res?.data.message });
    else {
      if (role === "teacher") router.replace("/dashboard/courses");
      else router.replace("/courses");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-2 w-full space-y-4"
      >
        <div className="text-sm text-red-500">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("login.email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("login.email_placeholder")}
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("login.password")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("login.password_placeholder")}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("login.signing_in")}
            </span>
          ) : (
            t("login.sign_in")
          )}
        </Button>
      </form>
    </Form>
  );
}
