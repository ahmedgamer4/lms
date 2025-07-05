"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  findCourseSection,
  findLesson,
  getCourse,
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
import { attempt } from "@/lib/utils";
import { DescriptionForm } from "./_components/description-form";
import { TitleForm } from "./_components/title-form";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: async () => {
      const [response, error] = await attempt(
        getCourse(Number(params.courseId)),
      );
      if (error) {
        toast.error("Error fetching course");
        return;
      }
      return response;
    },
  });

  const { data: section, isLoading: isSectionLoading } = useQuery({
    queryKey: ["section", params.sectionId],
    queryFn: async () => {
      const [response, error] = await attempt(
        findCourseSection(Number(params.courseId), Number(params.sectionId)),
      );
      if (error) {
        toast.error("Error fetching section");
        return;
      }
      return response;
    },
  });

  const { data: lessonData, isLoading: isLessonLoading } = useQuery({
    queryKey: ["lesson", params.lessonId],
    queryFn: async () => {
      const [response, error] = await attempt(
        findLesson(
          Number(params.courseId),
          Number(params.sectionId),
          Number(params.lessonId),
        ),
      );

      if (error) {
        toast.error("Failed to fetch lesson");
        return;
      }

      return response;
    },
  });

  useEffect(() => {
    if (lessonData?.data) {
      setTitle(lessonData.data.title);
    }
  }, [lessonData?.data]);

  async function handleUpdateTitle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsLoading(true);
    const [, error] = await attempt(
      updateLesson(
        Number(params.courseId),
        Number(params.sectionId),
        Number(params.lessonId),
        { title },
      ),
    );

    if (error) {
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
    const [, error] = await attempt(
      updateCourseSection(Number(params.courseId), Number(params.sectionId), {
        title: `${section?.data?.title} (Deleted)`,
      }),
    );

    if (error) {
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
    !course?.data ||
    !section?.data ||
    !lessonData?.data ||
    isLessonLoading ||
    isCourseLoading ||
    isSectionLoading
  ) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const lesson = lessonData.data;

  return (
    <div className="container mx-auto space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/courses/${course.data.id}`}>
              {course.data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashboard/courses/${course.data.id}/sections/${params.sectionId}`}
            >
              {section.data.title}
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
              Course: {course.data.title} - Section: {section.data.title}
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
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={handleDeleteLesson}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        <div className="w-full space-y-6 lg:w-1/2">
          <TitleForm
            initialData={{ title: lesson.title }}
            courseId={Number(params.courseId)}
            sectionId={Number(params.sectionId)}
            lessonId={Number(params.lessonId)}
          />

          <DescriptionForm
            initialData={JSON.parse(lesson.description)}
            courseId={Number(params.courseId)}
            sectionId={Number(params.sectionId)}
            lessonId={Number(params.lessonId)}
          />
        </div>

        <div className="grid w-full gap-6 lg:h-[515px] lg:w-1/2">
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
    </div>
  );
}
