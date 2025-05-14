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
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function StudentHomePage() {
  const [page, setPage] = useState(1);
  const [coursesType, setCoursesType] = useState<"enrolled" | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["student-courses", page],
    queryFn: async () =>
      await getCoursesByTeacherId(true, page, 8, false, true),
  });

  const {
    data: enrolledCourses,
    isLoading: enrolledCoursesLoading,
    isError: enrolledCoursesError,
  } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: async () => await getEnrolledCourses(),
  });

  if (
    isLoading ||
    !data ||
    !data.data ||
    enrolledCoursesLoading ||
    !enrolledCourses
  )
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (enrolledCoursesError) {
    toast.error("Error fetching enrolled courses");
  }

  const courses =
    coursesType === "all" ? data.data.courses : enrolledCourses.data?.data;
  const count = data.data.count || 0;

  const totalPages = Math.ceil(count / 8);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="mx-auto gap-8 space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <p className="text-muted-foreground mt-2">
          Explore our collection of courses and start learning today
        </p>
      </div>

      <div className="mt-4 mb-2">
        <Button
          variant={"link"}
          className={coursesType === "all" ? "underline" : ""}
          onClick={() => setCoursesType("all")}
        >
          All
        </Button>
        <Button
          variant={"link"}
          className={coursesType === "enrolled" ? "underline" : ""}
          onClick={() => setCoursesType("enrolled")}
        >
          Enrolled
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-6">
        {courses && courses.length === 0 ? (
          <div className="text-muted-foreground col-span-full text-center">
            No courses available at the moment
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
