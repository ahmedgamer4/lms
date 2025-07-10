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
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";

export function CreateCourseForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const t = useTranslations();

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
        className="mb-2 w-full space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2">{t("common.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("common.title")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {t("common.create")}
        </Button>
      </form>
    </Form>
  );
}
