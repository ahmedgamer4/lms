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
import { Button } from "@/components/ui/button";
import { attempt, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format-price";
import { updateCourse } from "@/lib/courses";
import { useTranslations } from "next-intl";

interface PriceFormProps {
  initialData: { price: string };
  courseId: number;
}

const formSchema = z.object({
  price: z.string(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [price, setPrice] = useState(initialData.price);
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const [, error] = await attempt(
        updateCourse(courseId, { price: values.price }),
      );
      if (error) {
        toast.error(tCommon("somethingWentWrong"));
      } else {
        setPrice(values.price);
        toast.success(tCommon("updatedSuccessfully"));
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error(tCommon("somethingWentWrong"));
    }
  };

  return (
    <div className="bg-primary/5 mt-6 rounded-lg border p-4">
      <div className="flex items-center justify-between font-medium">
        {t("coursePrice")}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>
              <IconX className="mr-0.5 h-4 w-4" />
              {tCommon("cancel")}
            </>
          ) : (
            <>
              <IconPencil className="mr-0.5 h-4 w-4" />
              {tCommon("edit")}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("mt-2 text-sm", !price && "text-slate-500 italic")}>
          {price ? formatPrice(price) : tCommon("noPriceAvailable")}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="eg 100"
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
