"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteCourse, updateCourse } from "@/lib/courses";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Trash, Loader2, Eye, EyeOff } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CourseEditForm({ course }: { course: any }) {
  const router = useRouter();
  const [publishLoading, setPublishLoading] = useState(false);
  const queryClient = useQueryClient();

  async function onClickPublish() {
    if (course.published) {
      setPublishLoading(true);
      const res = await updateCourse(course.id, { published: false });
      if (res.error) toast("Cannot unpublish course");
    } else {
      setPublishLoading(true);
      const res = await updateCourse(course.id, { published: true });
      if (res.error) toast("Cannot publish course");
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
    <div className="mt-3 w-full max-w-[1600px] space-y-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Course Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your course details and content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={publishLoading}
            variant={course.published ? "outline" : "default"}
            onClick={onClickPublish}
            className="gap-2"
          >
            {publishLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : course.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {course.published ? "Unpublish" : "Publish"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                disabled={publishLoading}
                variant="destructive"
                className="gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your course and remove all associated data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={publishLoading}
                  onClick={onClickDelete}
                  className="gap-2"
                >
                  {publishLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Delete Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-none">
          <CardHeader className="space-y-1 px-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <LayoutDashboard className="text-blue-900" />
              </div>
              <div>
                <CardTitle className="text-xl">Course Details</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Basic information about your course
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-0">
            <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <p className="text-muted-foreground text-sm">
                Manage your course chapters and lessons
              </p>
            </div>
            <Badge variant="secondary" className="font-medium">
              {course.chapters?.length || 0} Chapters
            </Badge>
          </div>
          <ChaptersList course={course} />
        </div>
      </div>
    </div>
  );
}
