"use client";

import * as z from "zod";
import {
  IconPencil,
  IconPlus,
  IconImageInPicture,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadCoverImage } from "@/lib/courses";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ImageFormProps {
  initialData: {
    imageUrl: string;
  };
  courseId: number;
}

const formSchema = z.object({
  coverImage: z.instanceof(File),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const [, error] = await attempt(
        uploadCoverImage(courseId, values.coverImage),
      );
      if (error) {
        toast.error(tCommon("somethingWentWrong"));
      } else {
        queryClient.invalidateQueries({
          queryKey: ["dashboard-course", courseId],
        });
        toast.success(tCommon("updatedSuccessfully"));
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error(tCommon("somethingWentWrong"));
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-primary/5 mt-6 rounded-lg border p-4">
      <div className="flex items-center justify-between font-medium">
        {t("courseImage")}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>
              <IconX className="mr-0.5 h-4 w-4" />
              {tCommon("cancel")}
            </>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <IconPlus className="mr-0.5 h-4 w-4" />
              {tCommon("add")}
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <IconPencil className="mr-0.5 h-4 w-4" />
              {tCommon("edit")}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <IconImageInPicture className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video h-10/12 w-full overflow-hidden">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field: { onChange, ref, value, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      accept="image/*"
                      type="file"
                      disabled={isSubmitting || !isValid}
                      ref={fileRef}
                      onChange={(event) => onChange(event.target.files?.[0])}
                      placeholder="e.g. 'Advanced web development'"
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting && (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tCommon("save")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
