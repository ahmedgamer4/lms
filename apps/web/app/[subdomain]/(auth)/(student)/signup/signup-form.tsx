"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Input } from "@/components/ui/input";
import { CreateStudentDto } from "@lms-saas/shared-lib/dtos";
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
import { signupStudent } from "@/lib/auth";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function SignupForm({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const t = useTranslations();

  const resolver = useMemo(() => {
    return classValidatorResolver(CreateStudentDto);
  }, []);

  const form = useForm<CreateStudentDto>({
    resolver,
    defaultValues: {
      email: "",
      name: "",
      password: "",
      teacherSubdomain: "",
    },
  });

  form.setValue("teacherSubdomain", subdomain);

  async function onSubmit(data: CreateStudentDto) {
    const [, error] = await attempt(signupStudent(data));
    if (error) {
      form.setError("root", { message: error.message });
    } else {
      router.push("/login");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-3 w-full space-y-3"
      >
        <div className="text-sm text-red-500">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("signup.username")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("signup.username_placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("signup.email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("signup.email_placeholder")}
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
              <FormLabel>{t("signup.password")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("signup.password_placeholder")}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">{t("signup.sign_up")}</Button>
      </form>
    </Form>
  );
}
