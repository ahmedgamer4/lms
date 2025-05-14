"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/lib/courses";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Clock,
  Loader2,
  Star,
  Users,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CoursePage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const { data: courseResponse, isLoading } = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: () => getCourse(courseId, true, true),
  });

  const course = courseResponse?.data?.data;

  if (isLoading || !course) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course.enrollments?.[0]) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">
          You are not enrolled in this course
        </h1>
        <Link href={`/courses/${courseId}/enroll`}>
          <Button>Enroll Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
              <span>Your Progress</span>
              <span>{course.enrollments[0].progress}%</span>
            </div>
            <div className="bg-secondary h-2 w-full rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${course.enrollments[0].progress}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="w-full md:w-[350px]">
          <CardHeader className="relative p-0">
            <div className="relative aspect-video">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
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
        </Card>
      </div>

      <Separator />

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
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}`}
                      className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                          <BookOpen className="text-primary h-4 w-4" />
                        </div>
                        <span>{lesson.title}</span>
                      </div>
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
