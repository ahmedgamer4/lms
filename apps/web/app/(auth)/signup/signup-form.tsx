"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Input } from "@/components/ui/input";
import { CreateTeacherDto } from "@lms-saas/shared-lib/dtos";
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
import { signupTeacher } from "@/lib/auth";

export function SignupForm() {
  const router = useRouter();
  const resolver = useMemo(() => {
    return classValidatorResolver(CreateTeacherDto);
  }, []);

  const form = useForm<CreateTeacherDto>({
    resolver,
    defaultValues: {
      email: "",
      name: "",
      password: "",
      subdomain: "",
    },
  });

  async function onSubmit(data: CreateTeacherDto) {
    const res = await signupTeacher(data);
    if (res?.status !== 201)
      form.setError("root", { message: res?.data.message });
    else {
      await fetch("/api/add-subdomain", {
        method: "POST",
        body: JSON.stringify({ subdomain: form.getValues().subdomain }),
      });
      router.push("/subdomain?subdomain=" + form.getValues().subdomain);
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
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
        <FormField
          control={form.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdomain</FormLabel>
              <FormControl>
                <Input placeholder="Your subdomain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Sign Up</Button>
      </form>
    </Form>
  );
}
