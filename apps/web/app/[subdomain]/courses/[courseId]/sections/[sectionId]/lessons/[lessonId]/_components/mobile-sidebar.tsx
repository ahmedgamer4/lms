import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import { CourseWithSectionsAndEnrollments } from "@/lib/courses";
import { useAtom } from "jotai";
import { localeAtom } from "@/lib/atoms";

export function MobileSidebar({
  course,
  lessonId,
}: {
  course: CourseWithSectionsAndEnrollments;
  lessonId: number;
}) {
  const [locale] = useAtom(localeAtom);

  return (
    <SheetContent side={locale === "ar" ? "right" : "left"}>
      <SheetHeader></SheetHeader>
      <div className="overflow-y-scroll px-4">
        <h3 className="text-primary text-xl font-semibold">{course.title}</h3>
        <SidebarContent course={course} lessonId={lessonId} />
      </div>
    </SheetContent>
  );
}
