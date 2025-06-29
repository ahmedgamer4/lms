"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import purify from "dompurify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { updateLesson } from "@/lib/courses";
import { attempt } from "@/lib/utils";
import { SerializedEditorState } from "lexical";
import { lexicalToHtml } from "@/lib/lexical-to-html";
import { Editor } from "@/components/blocks/editor-00/editor";
interface DescriptionFormProps {
  initialData: SerializedEditorState;
  courseId: number;
  sectionId: number;
  lessonId: number;
}

const formSchema = z.object({
  description: z
    .any()
    .refine((val) => val !== undefined, "Description is required"),
});

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export const DescriptionForm = ({
  initialData,
  courseId,
  sectionId,
  lessonId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const [, error] = await attempt(
        updateLesson(courseId, sectionId, lessonId, {
          description: JSON.stringify(values.description),
        }),
      );
      if (error) {
        toast.error("Something went wrong");
      } else {
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-primary/5 mt-6 rounded-lg border p-4">
      <div className="flex items-center justify-between font-medium">
        Lesson description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-0.5 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className="mt-2 text-sm text-balance break-all whitespace-normal"
          dangerouslySetInnerHTML={{
            __html: purify.sanitize(
              lexicalToHtml(form.getValues("description")),
            ),
          }}
        />
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      editorSerializedState={field.value}
                      onSerializedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
