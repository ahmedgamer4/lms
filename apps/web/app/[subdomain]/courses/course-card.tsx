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
import Image from "next/image";
import { useTranslations } from "next-intl";

export function CourseCard({ course }: { course: CourseWithEnrollments }) {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Card className="hover:border-primary/50 overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
      <CardHeader className="border-border relative border-b p-0">
        <div className="relative mb-0 aspect-video h-full">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              className="h-full w-full object-cover"
              width={300}
              height={192}
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
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {course.description || t("courses.noDescriptionAvailable")}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.studentsCount}
            <span>{t("courses.students")}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.lessonsCount}
            <span>{t("courses.lessons")}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* TODO: Add rating */}
            <Star className="h-4 w-4" />
            <span>{t("courses.rating")}</span>
          </div>
        </div>

        {course.enrollments?.[0] ? (
          <div>
            <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
              <span>{t("courses.progress")}</span>
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
              {t("courses.enrollNow")}
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
          {t("courses.courseDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
}
