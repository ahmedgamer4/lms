"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createQuiz, createQuizSchema, Quiz } from "@/lib/quizzes";
import { attempt } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuizDto } from "@lms-saas/shared-lib/dtos";
import { IconLoader, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CreateQuizDialogProps = {
  lessonId: number;
  quizzesNumber: number;
  onQuizCreated: (quiz: Quiz) => void;
};

export const CreateQuizDialog = ({
  quizzesNumber,
  lessonId,
  onQuizCreated,
}: CreateQuizDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createQuizSchema>>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      duration: 0,
    },
  });

  const t = useTranslations("lessons");
  const tCommon = useTranslations("common");

  const handleSubmit = async (data: CreateQuizDto) => {
    try {
      const [response, error] = await attempt(createQuiz(lessonId, data));
      if (error) {
        toast.error("Failed to create quiz");
        return;
      }

      onQuizCreated(response.data);
      setOpen(false);
      toast.success("Quiz created successfully");
    } catch (error) {
      toast.error("Failed to create quiz");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden={quizzesNumber >= 1} asChild>
        <Button hidden={quizzesNumber >= 1} className="gap-2">
          <IconPlus className="h-4 w-4" />
          {tCommon("create")} {t("quiz")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tCommon("create")} {t("quiz")}
          </DialogTitle>
          <DialogDescription>
            {t("addNewQuizToTestYourStudentsKnowledge")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mb-2 w-full space-y-4"
          >
            <div className="text-sm text-red-500">
              {form.formState.errors.root?.message}
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tCommon("titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("duration")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={tCommon("durationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <div>
                    <IconLoader className="animate-spin" />
                    {tCommon("creating")}...
                  </div>
                ) : (
                  tCommon("create")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
