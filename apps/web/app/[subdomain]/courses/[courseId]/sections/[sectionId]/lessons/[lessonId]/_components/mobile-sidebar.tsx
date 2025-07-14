import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import { CourseWithSectionsAndEnrollments } from "@/lib/courses";
import { useEffect, useState } from "react";

export function MobileSidebar({
  course,
  lessonId,
}: {
  course: CourseWithSectionsAndEnrollments;
  lessonId: number;
}) {
  const [locale, setLocale] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cookie = document.cookie;
    const locale = cookie
      .split("; ")
      .find((ele) => ele.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    setLocale(locale);
  }, []);

  return (
    <SheetContent side={locale === "ar" ? "right" : "left"}>
      <SheetHeader>
        <SheetTitle className="text-primary">{course.title}</SheetTitle>
      </SheetHeader>
      <div className="px-4">
        <SidebarContent course={course} lessonId={lessonId} />
      </div>
    </SheetContent>
  );
}
