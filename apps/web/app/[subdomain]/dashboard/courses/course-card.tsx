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

export function CourseCard({ course }: { course: SelectCourse }) {
  return (
    <Card className="group hover:border-primary/50 flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <img
          src={course.imageUrl || "https://placehold.co/600x400"}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            ${course.price}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600">
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
      </CardContent>

      <CardFooter className="border-t bg-gray-50/50 p-4">
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
