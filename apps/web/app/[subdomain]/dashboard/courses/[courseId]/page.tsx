"use client";

import { notFound, redirect, useParams } from "next/navigation";
import CourseEdit from "./course-edit";
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
import { Loader2 } from "lucide-react";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";

export default function EditCoursePage({}: {}) {
  const params = useParams();
  const courseId = Number.parseInt(params.courseId as string);

  if (isNaN(courseId)) {
    console.error("Invalid course ID:", params.courseId);
    notFound();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["dashboard-course", courseId],
    queryFn: async () => {
      const [response, error] = await attempt(getCourse(courseId, true));
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  const course = data?.data;
  if (!course) redirect("/dashboard/courses");

  return (
    <div className="container mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
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
