"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCoursesByTeacherId } from "@/lib/courses";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
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
import { attempt } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function CoursesPage() {
  const t = useTranslations("courses");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [published, setPublished] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-courses", page, published],
    queryFn: async () => {
      const [response, error] = await attempt(
        getCoursesByTeacherId(published, page, 8, false),
      );
      if (error) {
        toast.error("Error fetching courses");
        return;
      }
      return response;
    },
  });

  if (isLoading || !data)
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );

  const courses = data?.courses;
  const count = data?.count || 0;

  const totalPages = Math.ceil(count / 8);
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between md:flex-row">
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <DialogTrigger asChild className="place-self-end">
            <Button className="mt-2 md:mt-0" variant={"video"}>
              <Plus />
              {t("createCourse")}
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
              {t("published")}
            </Button>
            <Button
              className={!published ? "underline" : ""}
              variant={"link"}
              onClick={() => setPublished(false)}
            >
              {t("unpublished")}
            </Button>
          </div>

          <Separator />

          <div className="mt-4 grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-6">
            {courses.length === 0 ? (
              <div>{t("noCourses")}</div>
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
              size={"sm"}
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
          <DialogTitle>{t("createCourse")}</DialogTitle>
        </DialogHeader>
        <CreateCourseForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
