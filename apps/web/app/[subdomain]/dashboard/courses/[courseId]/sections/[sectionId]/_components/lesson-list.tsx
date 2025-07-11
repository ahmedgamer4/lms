"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  updateCourseSection,
  deleteLesson,
  CourseSection,
} from "@/lib/courses";
import { attempt } from "@/lib/utils";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type LessonsListProps = {
  course: any;
  sectionData: CourseSection;
  setSectionData: Dispatch<SetStateAction<CourseSection | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const LessonsList = ({
  sectionData,
  setSectionData,
  setIsLoading,
}: LessonsListProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const tLessons = useTranslations("lessons");
  const tCommon = useTranslations("common");

  async function handleDragEnd(result: any) {
    if (!result.destination || !sectionData) return;

    const { source, destination, type } = result;

    if (type === "lesson") {
      const lessons = [...sectionData.lessons];
      const [removed] = lessons.splice(source.index, 1);
      if (removed) {
        lessons.splice(destination.index, 0, removed);
        lessons.forEach((lesson, idx) => {
          lesson.orderIndex = idx;
        });

        setSectionData({
          ...sectionData,
          lessons,
        });

        try {
          setIsLoading(true);
          const [, error] = await attempt(
            updateCourseSection(
              Number(params.courseId),
              Number(params.sectionId),
              {
                title: sectionData.title,
                lessons: lessons.map((lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
                  orderIndex: lesson.orderIndex,
                })),
              },
            ),
          );

          if (error) {
            toast.error("Failed to update lesson order");
            // Revert changes on error
            setSectionData({
              ...sectionData,
              lessons: sectionData.lessons,
            });
          } else {
            toast.success("Lesson order updated");
            queryClient.invalidateQueries({
              queryKey: ["section", params.sectionId],
            });
          }
        } catch (error) {
          toast.error("Failed to update lesson order");
          // Revert changes on error
          setSectionData({
            ...sectionData,
            lessons: sectionData.lessons,
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  }

  async function removeLesson(lessonIndex: number, lessonId: number) {
    if (!sectionData) return;

    try {
      setIsLoading(true);
      const [, error] = await attempt(
        deleteLesson(
          Number(params.courseId),
          Number(params.sectionId),
          lessonId,
        ),
      );

      if (error) {
        toast.error("Failed to remove lesson");
        return;
      }

      const lessons = [...sectionData.lessons];
      lessons.splice(lessonIndex, 1);

      lessons.forEach((lesson, idx) => {
        lesson.orderIndex = idx;
      });

      setSectionData({
        ...sectionData,
        lessons,
      });
    } catch (error) {
      toast.error("Failed to remove lesson");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="lessons" type="lesson">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {sectionData?.lessons.map((lesson, lessonIndex) => (
              <Draggable
                key={`lesson-${lesson.id}-${lessonIndex}`}
                draggableId={`lesson-${lesson.id}`}
                index={lessonIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-card rounded-lg border p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          {...provided.dragHandleProps}
                          className="hover:bg-muted cursor-grab rounded-md p-1"
                        >
                          <GripVertical className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                          <Pencil className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lesson.title}</span>
                          <Badge variant="secondary">
                            {lesson.videos.length} {tLessons("videos")},{" "}
                            {lesson.quizzes.length} {tLessons("quizzes")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(lessonIndex, lesson.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/courses/${params.courseId}/sections/${params.sectionId}/lessons/${lesson.id}`,
                            )
                          }
                        >
                          {tLessons("editLesson")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
