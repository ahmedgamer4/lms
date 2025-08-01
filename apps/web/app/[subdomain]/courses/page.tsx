"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoursesByTeacherId, getEnrolledCourses } from "@/lib/courses";
import { CourseCard } from "./course-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function StudentHomePage() {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [coursesType, setCoursesType] = useState<"enrolled" | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student-courses", page],
    queryFn: async () => {
      const [response, error] = await attempt(
        getCoursesByTeacherId(true, page, 8, false, true),
      );
      if (error) {
        toast.error("Error fetching courses");
        return;
      }
      return response;
    },
  });

  const {
    data: enrolledCourses,
    isLoading: enrolledCoursesLoading,
    isError: enrolledCoursesError,
  } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: async () => {
      const [response, error] = await attempt(getEnrolledCourses());
      if (error) {
        toast.error("Error fetching enrolled courses");
        return;
      }
      return response;
    },
  });

  if (isLoading || !data || enrolledCoursesLoading || !enrolledCourses)
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );

  if (enrolledCoursesError) {
    toast.error(t("common.somethingWentWrong"));
  }

  const courses = coursesType === "all" ? data.courses : enrolledCourses.data;
  const count = data.count || 0;

  const totalPages = Math.ceil(count / 8);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto gap-8 space-y-4 px-4 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{t("courses.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("courses.description")}</p>
      </div>

      <div className="mt-4 mb-2">
        <Button
          variant={"link"}
          className={coursesType === "all" ? "underline" : ""}
          onClick={() => setCoursesType("all")}
        >
          {t("courses.all")}
        </Button>
        <Button
          variant={"link"}
          className={coursesType === "enrolled" ? "underline" : ""}
          onClick={() => setCoursesType("enrolled")}
        >
          {t("courses.enrolled")}
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-6">
        {courses && courses.length === 0 ? (
          <div className="text-muted-foreground col-span-full text-center">
            {t("courses.noCoursesAvailable")}
          </div>
        ) : (
          courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem className={page === 1 ? "hidden" : ""}>
            <PaginationPrevious
              size={"icon"}
              onClick={() => handlePageChange(page - 1)}
              aria-disabled={page === 1}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                size={"icon"}
                href="#"
                onClick={() => handlePageChange(i + 1)}
                isActive={i + 1 === page}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && <PaginationEllipsis />}

          <PaginationItem
            className={page === totalPages || totalPages === 0 ? "hidden" : ""}
          >
            <PaginationNext
              size={"sm"}
              onClick={() => handlePageChange(page + 1)}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
