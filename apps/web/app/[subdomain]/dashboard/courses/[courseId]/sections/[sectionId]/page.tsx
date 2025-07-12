"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CourseSection,
  createLesson,
  findCourseSection,
  getCourse,
  updateCourseSection,
} from "@/lib/courses";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Video, Trash2, Loader2, Plus, Pencil, ArrowLeft } from "lucide-react";
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
import Link from "next/link";
import { LessonsList } from "./_components/lesson-list";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";
export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [sectionData, setSectionData] = useState<CourseSection | null>(null);
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");
  const tLessons = useTranslations("lessons");

  const { data: course } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: async () => {
      const [data, error] = await attempt(getCourse(Number(params.courseId)));
      if (error) {
        toast.error(tCommon("somethingWentWrong"));
        return;
      }
      return data;
    },
  });

  const { data: section } = useQuery({
    queryKey: ["section", params.sectionId],
    queryFn: async () => {
      const [data, error] = await attempt(
        findCourseSection(Number(params.courseId), Number(params.sectionId)),
      );
      if (error) {
        toast.error(tCommon("somethingWentWrong"));
        return;
      }
      return data;
    },
  });

  useEffect(() => {
    if (section?.data) {
      setTitle(section.data.title);
      setSectionData({
        ...section.data,
        lessons: (section.data.lessons || []).map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          orderIndex: lesson.orderIndex,
          videos: lesson.videos,
          quizzes: lesson.quizzes,
          description: lesson.description,
        })),
      });
    }
  }, [section?.data]);

  async function handleUpdateTitle() {
    if (!title.trim()) {
      toast.error(tCommon("cannotBeEmpty"));
      return;
    }

    setIsLoading(true);
    const [, error] = await attempt(
      updateCourseSection(Number(params.courseId), Number(params.sectionId), {
        title,
      }),
    );

    if (error) {
      toast.error(tCommon("somethingWentWrong"));
    } else {
      toast.success(tCommon("updatedSuccessfully"));
      queryClient.invalidateQueries({
        queryKey: ["section", params.sectionId],
      });
    }
    setIsLoading(false);
  }

  async function handleDeleteSection() {
    setIsLoading(true);
    const [, error] = await attempt(
      updateCourseSection(Number(params.courseId), Number(params.sectionId), {
        title: `${section?.data?.title} (Deleted)`,
      }),
    );

    if (error) {
      toast.error(tCommon("somethingWentWrong"));
    } else {
      toast.success(tCommon("deletedSuccessfully"));
      router.push(`/dashboard/courses/${params.courseId}`);
    }
    setIsLoading(false);
  }

  async function addLesson() {
    if (!sectionData) return;
    const lessons = [...sectionData.lessons];

    const [lessonQuery, error] = await attempt(
      createLesson(course?.data?.id!, section?.data?.id!, {
        title: `Lesson ${lessons.length + 1}`,
        orderIndex: lessons.length,
      }),
    );
    if (error) {
      toast.error(tCommon("somethingWentWrong"));
      return;
    }

    lessons.push({
      id: lessonQuery.data.id,
      title: `Lesson ${lessons.length + 1}`,
      orderIndex: lessons.length,
      videos: [],
      quizzes: [],
      description: "",
    });

    setSectionData({
      ...sectionData,
      lessons,
    });
  }

  if (!course?.data || !section?.data) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">
              {t("title")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/courses/${course.data.id}`}>
              {course.data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{section.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="items-center justify-between md:flex">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/courses/${params.courseId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="rotate-rtl h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{tCommon("edit")}</h1>
            <p className="text-muted-foreground">
              {t("course")}: {course.data.title}
            </p>
          </div>
        </div>
        <AlertDialog>
          <div className="flex w-full justify-end md:w-auto">
            <AlertDialogTrigger asChild>
              <Button className="mt-2 md:mt-0" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {tCommon("delete")} {t("section")}
              </Button>
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{tCommon("areYouSure")}?</AlertDialogTitle>
              <AlertDialogDescription>
                {tCommon("deleteDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={handleDeleteSection}
              >
                {tCommon("delete")}
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
                <CardTitle className="text-xl">
                  {tCommon("details")} {t("section")}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {tCommon("basicInformation")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">{tCommon("title")}</Label>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={tCommon("titlePlaceholder")}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpdateTitle}
                    disabled={isLoading}
                    className="w-full md:w-[100px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      tCommon("save")
                    )}
                  </Button>
                </div>
              </div>
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
                <CardTitle className="text-xl">{tCommon("content")}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {tLessons("createLesson")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <LessonsList
              course={course}
              sectionData={sectionData!}
              setIsLoading={setIsLoading}
              setSectionData={setSectionData}
            />
            <Button
              onClick={addLesson}
              variant="outline"
              className="mt-4 w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {tLessons("createLesson")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
