"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectCourse } from "@lms-saas/shared-lib";
import { Pen } from "lucide-react";
import Link from "next/link";

export function CourseCard({ course }: { course: SelectCourse }) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
      <CardHeader className="p-0">
        <img
          src={course.imageUrl || "https://placehold.co/600x400"}
          alt={course.title}
          className="h-52 w-full object-cover"
        />
      </CardHeader>

      <CardContent className="h-32 p-4">
        <h3 className="truncate text-lg font-semibold text-gray-800">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {course.description || "No description available for this course."}
        </p>
        <div className="mt-2">
          {/* Fixed spacing between description and price */}
          <span className="text-sm text-gray-500">Price:</span>
          <span className="ml-2 text-base font-medium text-gray-800">
            ${course.price}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 p-4">
        <Link href={`/dashboard/courses/${course.id}`} className="w-full">
          <Button
            className="w-full text-sm"
            onClick={() => console.log(`Editing course: ${course.title}`)}
          >
            <Pen className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
