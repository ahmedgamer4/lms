"use client";

import { notFound, redirect, useParams } from "next/navigation";
import CourseEdit from "./_components/course-edit";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/lib/courses";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { IconLoader } from "@tabler/icons-react";

export default function EditCoursePage({}: {}) {
  const t = useTranslations("courses");
  const params = useParams();
  const courseId = Number.parseInt(params.courseId as string);

  if (isNaN(courseId)) {
    console.error("Invalid course ID:", params.courseId);
    notFound();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["dashboard-course", courseId],
    queryFn: async () => {
      const [response, error] = await attempt(
        getCourse(courseId, true, false, true),
      );
      if (error) {
        toast.error("Error fetching course");
        return;
      }
      return response;
    },
  });

  if (isLoading)
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <IconLoader className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );

  const course = data?.data;
  if (!course) redirect("/dashboard/courses");

  return (
    <div className="container mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">
              {t("title")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CourseEdit course={course} />
    </div>
  );
}
