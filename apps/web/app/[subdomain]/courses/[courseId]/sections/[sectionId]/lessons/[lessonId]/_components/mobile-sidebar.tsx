import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import { CourseWithSectionsAndEnrollments } from "@/lib/courses";

export function MobileSidebar({
  course,
  lessonId,
}: {
  course: CourseWithSectionsAndEnrollments;
  lessonId: number;
}) {
  return (
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle className="text-primary">{course.title}</SheetTitle>
      </SheetHeader>
      <div className="px-4">
        <SidebarContent course={course} lessonId={lessonId} />
      </div>
    </SheetContent>
  );
}
