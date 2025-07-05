"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectCourse } from "@lms-saas/shared-lib";
import { Pen, Users, Clock, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function CourseCard({
  course,
}: {
  course: SelectCourse & { studentsCount: number };
}) {
  return (
    <Card className="group hover:border-primary/50 flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <Image
          width={600}
          height={192}
          src={course.imageUrl || "https://picsum.photos/600/400"}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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
            {course.description || "No description available for this course."}
          </p>
        </div>

        <div className="text-muted-foreground mt-auto flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.studentsCount} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.lessonsCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>0.0</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-accent/50 border-t p-4">
        <Link href={`/dashboard/courses/${course.id}`} className="w-full">
          <Button
            variant="default"
            className="w-full gap-2 text-sm transition-colors"
          >
            <Pen className="h-4 w-4" />
            Edit Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
