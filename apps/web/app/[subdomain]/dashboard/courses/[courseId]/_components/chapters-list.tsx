"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CourseSection,
  createCourseSection,
  deleteCourseSection,
  updateCourseSection,
} from "@/lib/courses";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ListChecks, Plus, GripVertical, Trash2, Pen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const ChaptersList = ({ course }: { course: any }) => {
  const [sections, setSections] = useState<Omit<CourseSection, "courseId">[]>(
    course?.courseSections || [],
  );
  async function addSection() {
    const newSection = {
      title: "New Section",
      orderIndex: sections.length,
    };

    const res = await createCourseSection(course.id, newSection);
    if (res.error) {
      console.log(res.error);
    } else {
      setSections([...sections, res.data?.data[0]!]);
    }
  }

  async function removeSection(index: number) {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);

    // Update order indices
    updatedSections.forEach((section, idx) => {
      section.orderIndex = idx;
    });

    setSections(updatedSections);
    await deleteCourseSection(course.id, sections[index]!.id);
  }

  function handleDragEnd(result: any) {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "section") {
      const reorderedSections = [...sections];
      const [removed] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, removed!);

      reorderedSections.forEach(async (section, idx) => {
        section.orderIndex = idx;
        await updateCourseSection(course.id, section.id, {
          orderIndex: idx,
        });
      });

      setSections(reorderedSections);
    }
  }
  return (
    <Card className="mt-4 border-none shadow-none lg:mt-0 lg:w-1/2">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <ListChecks className="text-blue-900" />
          </div>
          Course Details
        </CardTitle>
        <Button type="button" onClick={addSection} variant="default" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <Card className="bg-primary/5 shadow-none">
          <CardContent className="p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections" type="section">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {sections.length > 0 ? (
                      sections.map((section, sectionIndex) => (
                        <Draggable
                          key={`section-${sectionIndex}`}
                          draggableId={`section-${sectionIndex}`}
                          index={sectionIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-background rounded-lg border p-4"
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-grab"
                                  >
                                    <GripVertical className="text-muted-foreground h-5 w-5" />
                                  </div>
                                  <div>{section.title}</div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSection(sectionIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Link
                                href={`/dashboard/courses/${course.id}/sections/${section.id}`}
                              >
                                <Button variant={"outline"} className="w-full">
                                  <Pen /> Edit
                                </Button>
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-muted-foreground p-4 text-center">
                        No sections created yet. Click "Add Section" to get
                        started.
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
