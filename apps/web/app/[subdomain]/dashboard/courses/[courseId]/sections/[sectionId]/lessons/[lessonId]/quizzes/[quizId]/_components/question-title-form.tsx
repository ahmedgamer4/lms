"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateQuestion } from "@/lib/quizzes";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface QuestionTitleFormProps {
  initialData: {
    questionText: string;
  };
  questionId: number;
}

const formSchema = z.object({
  questionText: z.string().min(1, {
    message: "Title is required",
  }),
});

export const QuestionTitleForm = ({
  initialData,
  questionId,
}: QuestionTitleFormProps) => {
  const [questionText, setQuestionText] = useState(initialData.questionText);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const [, error] = await attempt(
        updateQuestion(questionId, { questionText: values.questionText }),
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      setQuestionText(values.questionText);
      toast.success(t("quizzes.quizUpdatedSuccessfully"));
      toggleEdit();
      router.refresh();
    } catch {
      toast.error(t("common.somethingWentWrong"));
    }
  };

  return (
    <div className="bg-primary/5 rounded-lg border p-4">
      <div className="flex items-center justify-between font-medium">
        {t("quizzes.question")}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>
              <IconX className="mr-0.5 h-4 w-4" />
              {t("common.cancel")}
            </>
          ) : (
            <>
              <IconPencil className="mr-0.5 h-4 w-4" />
              {t("common.edit")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{questionText}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={t("common.titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {t("common.save")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
