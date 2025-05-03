"use client";

import { notFound, redirect, useParams } from "next/navigation";
import CourseEditForm from "./course-edit-form";
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

export default function EditCoursePage({}: {}) {
  const params = useParams();
  const courseId = Number.parseInt(params.courseId as string);

  if (isNaN(courseId)) {
    console.error("Invalid course ID:", params.courseId);
    notFound();
  }

  const { isLoading, data } = useQuery({
    queryKey: ["dashboard-course", courseId],
    queryFn: () => getCourse(courseId),
  });

  if (isLoading) return <div>Loading...</div>;

  const course = data?.data?.data;
  if (!course) redirect("/dashboard/courses");

  return (
    <div className="container">
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

      <h1 className="mt-3 text-3xl font-bold">Course Setup</h1>
      <CourseEditForm course={course} />
    </div>
  );
}
