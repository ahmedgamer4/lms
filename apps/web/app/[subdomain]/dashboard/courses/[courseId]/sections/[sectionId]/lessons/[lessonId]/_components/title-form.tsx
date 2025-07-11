"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
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
import { updateLesson } from "@/lib/courses";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";
interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: number;
  sectionId: number;
  lessonId: number;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const TitleForm = ({
  initialData,
  courseId,
  sectionId,
  lessonId,
}: TitleFormProps) => {
  const [title, setTitle] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);

  const t = useTranslations("lessons");
  const tCommon = useTranslations("common");

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const [, error] = await attempt(
        updateLesson(courseId, sectionId, lessonId, {
          title: values.title,
        }),
      );
      if (error) {
        toast.error(tCommon("somethingWentWrong"));
      } else {
        setTitle(values.title);
        toast.success(tCommon("updatedSuccessfully"));
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error(tCommon("somethingWentWrong"));
    }
  };

  return (
    <div className="bg-primary/5 rounded-lg border p-4">
      <div className="flex items-center justify-between font-medium">
        {t("lessonTitle")}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>
              <X className="mr-0.5 h-4 w-4" />
              {tCommon("cancel")}
            </>
          ) : (
            <>
              <Pencil className="mr-0.5 h-4 w-4" />
              {tCommon("edit")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={tCommon("titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {tCommon("save")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
