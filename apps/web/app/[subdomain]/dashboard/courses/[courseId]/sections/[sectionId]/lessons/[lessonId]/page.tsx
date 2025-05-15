"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  findCourseSection,
  findLesson,
  getCourse,
  Lesson,
  updateCourseSection,
  updateLesson,
} from "@/lib/courses";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Video, Trash2, Loader2, Pencil, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LessonTabs } from "./_components/lesson-tabs";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const { data: course } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => getCourse(Number(params.courseId)),
  });

  const { data: section } = useQuery({
    queryKey: ["section", params.sectionId],
    queryFn: () =>
      findCourseSection(Number(params.courseId), Number(params.sectionId)),
  });

  const { data: lessonData, isLoading: isLessonLoading } = useQuery({
    queryKey: ["lesson", params.lessonId],
    queryFn: async () => {
      const res = await findLesson(
        Number(params.courseId),
        Number(params.sectionId),
        Number(params.lessonId),
      );

      if (res.error) {
        toast.error("Failed to fetch lesson");
      }

      if (res.data?.data) {
        setTitle(res.data.data.title);
      }

      return res;
    },
  });

  async function handleUpdateTitle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsLoading(true);
    const res = await updateLesson(
      Number(params.courseId),
      Number(params.sectionId),
      Number(params.lessonId),
      { title },
    );

    if (res.error) {
      toast.error("Failed to update lesson title");
    } else {
      toast.success("Lesson title updated");
      queryClient.invalidateQueries({
        queryKey: ["section", params.sectionId],
      });
    }
    setIsLoading(false);
  }

  async function handleDeleteLesson() {
    setIsLoading(true);
    const res = await updateCourseSection(
      Number(params.courseId),
      Number(params.sectionId),
      { title: `${section?.data?.data.title} (Deleted)` },
    );

    if (res.error) {
      toast.error("Failed to delete lesson");
    } else {
      toast.success("Lesson deleted");
      router.push(
        `/dashboard/courses/${params.courseId}/sections/${params.sectionId}`,
      );
    }
    setIsLoading(false);
  }

  if (
    !course?.data?.data ||
    !section?.data?.data ||
    !lessonData ||
    !lessonData.data ||
    isLessonLoading
  ) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const lesson = lessonData.data.data;

  return (
    <div className="container mx-auto space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/courses/${course.data.data.id}`}>
              {course.data.data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashboard/courses/${course.data.data.id}/sections/${params.sectionId}`}
            >
              {section.data.data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Lesson</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="items-center justify-between md:flex">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/courses/${params.courseId}/sections/${params.sectionId}`}
          >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Lesson</h1>
            <p className="text-muted-foreground">
              Course: {course.data.data.title} - Section:{" "}
              {section.data.data.title}
            </p>
          </div>
        </div>
        <AlertDialog>
          <div className="flex w-full justify-end">
            <AlertDialogTrigger asChild>
              <Button className="mt-2 md:mt-0" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Lesson
              </Button>
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will mark the lesson as
                deleted and remove it from the section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLesson}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card className="shadow-none">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Pencil className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Lesson Details</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Basic information about your lesson
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <form onSubmit={handleUpdateTitle} className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter lesson title"
                    className="flex-1"
                  />
                  <Button disabled={isLoading} className="w-[100px]">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Video className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Lesson Content</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Add videos and quizzes to your lesson
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <LessonTabs lesson={lesson} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
