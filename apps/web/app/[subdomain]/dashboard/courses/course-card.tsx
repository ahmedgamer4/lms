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

export function CourseCard({ course }: { course: SelectCourse }) {
  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-md transition-shadow rounded-lg">
      <CardHeader className="p-0">
        <img
          src={course.imageUrl || "https://placehold.co/600x400"}
          alt={course.title}
          className="object-cover w-full h-36"
        />
      </CardHeader>

      <CardContent className="p-4 h-40">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {course.description || "No description available for this course."}
        </p>
        <div className="mt-6">
          {/* Fixed spacing between description and price */}
          <span className="text-sm text-gray-500">Price:</span>
          <span className="ml-2 text-base font-medium text-gray-800">
            ${course.price}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 border-t">
        <Button
          variant="holo"
          className="w-full text-sm "
          onClick={() => console.log(`Editing course: ${course.title}`)}
        >
          <Pen className="w-4 h-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
