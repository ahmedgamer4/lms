"use client";

import { Button } from "@/components/ui/button";
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

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [sectionData, setSectionData] = useState<CourseSection | null>(null);

  const { data: course } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => getCourse(Number(params.courseId)),
  });

  const { data: section } = useQuery({
    queryKey: ["section", params.sectionId],
    queryFn: () =>
      findCourseSection(Number(params.courseId), Number(params.sectionId)),
  });

  useEffect(() => {
    if (section?.data?.data) {
      setTitle(section.data.data.title);
      setSectionData({
        ...section.data.data,
        lessons: (section.data.data.lessons || []).map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          orderIndex: lesson.orderIndex,
          videos: [],
          quizzes: [],
        })),
      });
    }
  }, [section?.data?.data]);

  async function handleUpdateTitle() {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    setIsLoading(true);
    const res = await updateCourseSection(
      Number(params.courseId),
      Number(params.sectionId),
      { title },
    );

    if (res.error) {
      toast.error("Failed to update section title");
    } else {
      toast.success("Section title updated");
      queryClient.invalidateQueries({
        queryKey: ["section", params.sectionId],
      });
    }
    setIsLoading(false);
  }

  async function handleDeleteSection() {
    setIsLoading(true);
    const res = await updateCourseSection(
      Number(params.courseId),
      Number(params.sectionId),
      { title: `${section?.data?.data.title} (Deleted)` },
    );

    if (res.error) {
      toast.error("Failed to delete section");
    } else {
      toast.success("Section deleted");
      router.push(`/dashboard/courses/${params.courseId}`);
    }
    setIsLoading(false);
  }

  async function addLesson() {
    if (!sectionData) return;
    const lessons = [...sectionData.lessons];

    const lessonQuery = await createLesson(
      course?.data?.data.id!,
      section?.data?.data.id!,
      {
        title: `Lesson ${lessons.length + 1}`,
        orderIndex: lessons.length,
      },
    );
    if (lessonQuery.error) {
      toast.error("Cannot create lesson");
      return;
    }

    lessons.push({
      id: lessonQuery.data!.data.id,
      title: `Lesson ${lessons.length + 1}`,
      orderIndex: lessons.length,
      videos: [],
      quizzes: [],
    });

    setSectionData({
      ...sectionData,
      lessons,
    });
  }

  if (!course?.data?.data || !section?.data?.data) {
    return <div>Loading...</div>;
  }

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
            <BreadcrumbPage>{section.data.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/courses/${params.courseId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Section</h1>
            <p className="text-muted-foreground">
              Course: {course.data.data.title}
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Section
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will mark the section as
                deleted and remove it from the course.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSection}>
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
                <CardTitle className="text-xl">Section Details</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Basic information about your section
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleUpdateTitle}
                    disabled={isLoading}
                    className="w-[100px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
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
                <CardTitle className="text-xl">Section Content</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Add lessons with videos and quizzes
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
              Add Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
