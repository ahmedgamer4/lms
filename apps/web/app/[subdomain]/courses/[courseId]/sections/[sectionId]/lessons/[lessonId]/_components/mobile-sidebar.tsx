import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import { CourseWithSectionsAndEnrollments } from "@/lib/courses";

export function MobileSidebar({
  course,
  sectionId,
  lessonId,
}: {
  course: CourseWithSectionsAndEnrollments;
  sectionId: number;
  lessonId: number;
}) {
  return (
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Course Content</SheetTitle>
      </SheetHeader>
      <div className="px-4">
        <SidebarContent
          course={course}
          sectionId={sectionId}
          lessonId={lessonId}
        />
      </div>
    </SheetContent>
  );
}
