"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Input } from "@/components/ui/input";
import { LoginTeacherDto } from "@lms-saas/shared-lib/dtos";
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
import { loginTeacher } from "@/lib/auth";

export function TeacherLoginForm() {
  const router = useRouter();
  const resolver = useMemo(() => {
    return classValidatorResolver(LoginTeacherDto);
  }, []);

  const form = useForm<LoginTeacherDto>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginTeacherDto) {
    const res = await loginTeacher(data);
    if (res?.status !== 200)
      form.setError("root", { message: res?.data.message });
    else {
      router.replace("/dashboard/courses");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mb-2 w-full"
      >
        <div className="text-red-500 text-sm">
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
        <Button className="w-full">Sign In</Button>
      </form>
    </Form>
  );
}
