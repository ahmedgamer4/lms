"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteCourse, updateCourse } from "@/lib/courses";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Trash, Loader2 } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { PriceForm } from "./_components/price-form";
import { ImageForm } from "./_components/image-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ChaptersList } from "./_components/chapters-list";

export default function CourseEditForm({ course }: { course: any }) {
  const router = useRouter();
  const [publishLoading, setPublishLoading] = useState(false);
  const queryClient = useQueryClient();

  async function onClickPublish() {
    if (course.published) {
      setPublishLoading(true);
      const res = await updateCourse(course.id, { published: false });
      if (res.error) toast("Cannot publish course");
    } else {
      setPublishLoading(true);
      const res = await updateCourse(course.id, { published: true });
      if (res.error) toast("Cannot unpublish course");
    }
    queryClient.invalidateQueries({
      queryKey: ["dashboard-course", course.id],
    });
    setPublishLoading(false);
  }

  async function onClickDelete() {
    setPublishLoading(true);
    const res = await deleteCourse(course.id);
    if (res.error) toast("Cannot delete course");
    setPublishLoading(false);
    router.replace("/dashboard/courses");
  }

  return (
    <div className="w-full max-w-[1600px]">
      <div className="flex w-full items-center justify-between">
        <span className="text-muted-foreground text-center">
          Edit course details
        </span>
        <div className="flex gap-2">
          <Button
            disabled={publishLoading}
            variant={"outline"}
            onClick={onClickPublish}
          >
            {publishLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {course.published ? "Unpublish" : "Publish"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={publishLoading} variant={"destructive"}>
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  this course and remove your data from our servers.
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant={"destructive"}
                    disabled={publishLoading}
                    onClick={onClickDelete}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full justify-between gap-6 lg:flex">
        <Card className="border-none shadow-none lg:w-1/2">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <LayoutDashboard className="text-blue-900" />
              </div>
              Course Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-0">
            <TitleForm
              courseId={course.id}
              initialData={{ title: course.title }}
            />
            <DescriptionForm
              courseId={course.id}
              initialData={{ description: course.description }}
            />
            <PriceForm
              courseId={course.id}
              initialData={{ price: course.price }}
            />
            <ImageForm initialData={course} courseId={course.id} />
          </CardContent>
        </Card>
        <ChaptersList course={course} />
      </div>
    </div>
  );
}
