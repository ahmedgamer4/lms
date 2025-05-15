import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { CourseWithSectionsAndEnrollments } from "@/lib/courses";

export function SidebarContent({
  course,
  sectionId,
  lessonId,
}: {
  course: CourseWithSectionsAndEnrollments;
  sectionId: number;
  lessonId: number;
}) {
  return (
    <div className="space-y-4">
      {course.courseSections?.map((section) => (
        <div key={section.id}>
          <Accordion
            defaultValue={
              section.id === sectionId ? section.id.toString() : undefined
            }
            type="single"
            collapsible
          >
            <AccordionItem value={section.id.toString()}>
              <AccordionTrigger className="text-primary">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-2 space-y-2">
                  {section.lessons?.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/courses/${course.id}/sections/${section.id}/lessons/${l.id}`}
                        className={`hover:bg-primary/10 block rounded px-2 py-2 transition-colors ${l.id === lessonId ? "bg-primary/10 font-bold" : ""}`}
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
