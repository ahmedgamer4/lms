"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { CourseWithEnrollments } from "@/lib/courses";

export function CourseCard({ course }: { course: CourseWithEnrollments }) {
  const router = useRouter();

  return (
    <Card className="hover:border-primary/50 overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
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

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-lg font-semibold">{course.title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {course.description || "No description available for this course."}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-4 text-sm text-gray-500">
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

        {course.enrollments?.[0] ? (
          <div>
            <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
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
        ) : (
          <div>
            <Button
              variant="outline"
              className="w-full gap-2 text-sm transition-colors"
              onClick={() => router.push(`/courses/${course.id}/enroll`)}
            >
              <BookOpen className="h-4 w-4" />
              Enroll Now
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button
          variant="default"
          className="w-full gap-2 text-sm transition-colors"
          onClick={() => router.push(`/courses/${course.id}`)}
        >
          <BookOpen className="h-4 w-4" />
          Course Details
        </Button>
      </CardFooter>
    </Card>
  );
}
