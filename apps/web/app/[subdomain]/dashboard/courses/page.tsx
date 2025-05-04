"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCoursesByTeacherId } from "@/lib/courses";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { CourseCard } from "./course-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCourseForm } from "./create-course-form";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [published, setPublished] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-courses", page, published],
    queryFn: async () => await getCoursesByTeacherId(published, page, 8, false),
  });

  if (isLoading || !data || !data.data) return <div>Loading...</div>;

  const courses = data.data.courses;
  const count = data.data.count || 0;

  const totalPages = Math.ceil(count / 8);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full pr-8">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              New Course
            </Button>
          </DialogTrigger>
        </div>

        <div>
          <div className="mt-4 mb-2">
            <Button
              variant={"link"}
              className={published ? "underline" : ""}
              onClick={() => setPublished(true)}
            >
              Published
            </Button>
            <Button
              className={!published ? "underline" : ""}
              variant={"link"}
              onClick={() => setPublished(false)}
            >
              Unpublished
            </Button>
          </div>
          <Separator />
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-6">
            {courses.length === 0 ? (
              <div>No Courses</div>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
      <Pagination className="mt-4">
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <CreateCourseForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
