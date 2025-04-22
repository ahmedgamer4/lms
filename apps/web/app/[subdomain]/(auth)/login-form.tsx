"use client";

import React, { useMemo } from "react";
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

export function LoginForm({
  subdomain,
  role,
}: {
  subdomain: string;
  role: string;
}) {
  const router = useRouter();
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

  async function onSubmit(data: LoginUserDto) {
    data.subdomain = subdomain;
    console.log(subdomain);
    const res = await loginUser(data);
    console.log(res);
    if (res?.status !== 200)
      form.setError("root", { message: res?.data.message });
    else {
      if (role === "teacher") router.replace("/dashboard/courses");
      else router.replace("/home");
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={"bw"} type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
