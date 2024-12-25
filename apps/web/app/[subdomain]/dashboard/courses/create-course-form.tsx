"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCourse } from "@/lib/courses";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { CreateCourseDto } from "@lms-saas/shared-lib/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";

export function CreateCourseForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-courses"] });
    },
  });

  const resolver = useMemo(() => {
    return classValidatorResolver(CreateCourseDto);
  }, []);

  const form = useForm<CreateCourseDto>({
    resolver,
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: CreateCourseDto) {
    await mutateAsync(data);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mb-2 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Create</Button>
      </form>
    </Form>
  );
}
