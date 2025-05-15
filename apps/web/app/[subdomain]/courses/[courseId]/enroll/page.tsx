"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollInCourse, getCourse } from "@/lib/courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { BookOpen, Clock, Loader2, Star, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CourseEnrollPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const courseId = Number(params.courseId);

  const { data: courseResponse, isLoading } = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: () => getCourse(courseId, true, true),
  });

  const course = courseResponse?.data?.data;

  const { mutate: enrollInCourseMutate, isPending } = useMutation({
    mutationFn: () => enrollInCourse(courseId),
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.response.data.message);
      } else {
        toast.success("Successfully enrolled in the course!");
        queryClient.invalidateQueries({
          queryKey: ["student-course", course?.id],
        });
      }
    },
    onError: () => {
      toast.error("Failed to enroll in the course. Please try again.");
    },
  });

  if (isLoading || !course) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col justify-between gap-8 px-4 py-8 md:flex-row md:items-start">
      <div className="flex-1">
        <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground mb-6 max-w-xl">
          {course.description}
        </p>
        <div className="overflow-hidden rounded-md">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <BookOpen className="text-primary h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Course Content</h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  {course.courseSections?.length || 0} chapters •{" "}
                  {course.courseSections?.reduce(
                    (acc, section) => acc + (section.lessons?.length || 0),
                    0,
                  )}{" "}
                  lessons
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {course.courseSections?.map((section) => (
                <Card key={section.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4">
                    <h3 className="font-semibold">{section.title}</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {section.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                              <BookOpen className="text-primary h-4 w-4" />
                            </div>
                            <span>{lesson.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[40%]">
        <Card className="hover:border-primary/50 w-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
          <CardHeader className="relative p-0">
            <div className="relative aspect-video">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  className="h-72 w-full object-cover"
                  width={600}
                  height={192}
                />
              ) : (
                <div className="bg-muted flex h-72 w-full items-center justify-center">
                  <BookOpen className="text-muted-foreground h-12 w-12" />
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="border-border border backdrop-blur-sm"
              >
                ${course.price}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 p-4">
            <div className="space-y-1">
              <h3 className="text-primary line-clamp-1 text-lg font-semibold">
                {course.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {course.description ||
                  "No description available for this course."}
              </p>
            </div>

            <div className="text-muted-foreground mt-auto flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>0 students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>0 hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>0.0</span>
              </div>
            </div>

            {course.enrollments?.[0] && (
              <div>
                <div className="text-muted-foreground mb-1 flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.enrollments[0].progress}%</span>
                </div>
                <div className="bg-secondary h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${course.enrollments[0].progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-muted/50 border-t p-4">
            {course.enrollments?.[0] ? (
              <Link
                href={`/courses/${courseId}`}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full gap-2 text-sm transition-colors",
                )}
              >
                <BookOpen className="h-4 w-4" />
                Course Details
              </Link>
            ) : (
              <Button
                variant="default"
                className="w-full gap-2 text-sm transition-colors"
                onClick={() => enrollInCourseMutate()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
                {isPending ? "Enrolling..." : "Enroll Now"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
