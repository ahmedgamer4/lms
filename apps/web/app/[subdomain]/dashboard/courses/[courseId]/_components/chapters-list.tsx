"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";
export const ChaptersList = ({ course }: { course: any }) => {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<Omit<CourseSection, "courseId">[]>(
    course?.courseSections || [],
  );

  async function addSection() {
    const newSection = {
      title: "New Section",
      orderIndex: sections.length,
    };

    const [res, error] = await attempt(
      createCourseSection(course.id, newSection),
    );
    if (error) {
      console.log(error);
    } else {
      setSections([...sections, res.data[0]!]);
      queryClient.invalidateQueries({
        queryKey: ["dashboard-course", course.id],
      });
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
    const [, error] = await attempt(
      deleteCourseSection(course.id, sections[index]!.id),
    );
    if (error) {
      toast.error("Something went wrong");
    }
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
        const [, error] = await attempt(
          updateCourseSection(course.id, section.id, {
            orderIndex: idx,
          }),
        );
        if (error) {
          toast.error("Something went wrong");
        }
      });

      setSections(reorderedSections);
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 p-0">
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
                          className="group bg-card hover:border-primary/50 relative rounded-lg border p-4 transition-all hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-1 items-start gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="hover:bg-muted mt-1 cursor-grab rounded-md p-1"
                              >
                                <GripVertical className="text-muted-foreground h-4 w-4" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <h3 className="font-medium">{section.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                  Press edit to see details
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/courses/${course.id}/sections/${section.id}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Pen className="h-4 w-4" />
                                  Edit
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Section
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this
                                      section? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        removeSection(sectionIndex)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <ListChecks className="text-muted-foreground mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-medium">
                      No sections created yet
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Get started by creating your first course section
                    </p>
                    <Button onClick={addSection} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Section
                    </Button>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {sections.length > 0 && (
          <Button
            onClick={addSection}
            variant="outline"
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
