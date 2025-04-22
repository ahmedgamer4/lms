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

export function SignupForm({ subdomain }: { subdomain: string }) {
  console.log(subdomain);
  const router = useRouter();
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
    const res = await signupStudent(data);
    console.log(res);
    if (res.error) {
      form.setError("root", { message: res.error.response.data.message });
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
        <Button className="w-full">Sign Up</Button>
      </form>
    </Form>
  );
}
