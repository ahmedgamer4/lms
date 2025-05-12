"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  addAnswer,
  deleteAnswer,
  getQuizQuestions,
  QuizQuestion,
  updateAnswer,
  updateQuiz,
} from "@/lib/quizzes";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, GripVertical, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionDialog } from "./_components/question-dialog";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { findCourseSection, findLesson } from "@/lib/courses";
import { getCourse } from "@/lib/courses";
import { deleteQuestion, updateQuestion } from "@/lib/quizzes";
import { QuizAnswer } from "@/lib/quizzes";
import { UpdateQuizQuestionDto } from "@lms-saas/shared-lib/dtos";
import { QuestionTitleForm } from "./_components/question-title-form";
import { AnswerEditForm } from "./_components/answer-edit-form";

export default function QuizEditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const { data: course } = useQuery({
    queryKey: ["course", params.courseId],
    queryFn: () => getCourse(Number(params.courseId)),
  });

  const { data: section } = useQuery({
    queryKey: ["section", params.sectionId],
    queryFn: () =>
      findCourseSection(Number(params.courseId), Number(params.sectionId)),
  });

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useQuery({
    queryKey: ["lesson", params.lessonId],
    queryFn: () =>
      findLesson(
        Number(params.courseId),
        Number(params.sectionId),
        Number(params.lessonId),
      ),
  });

  const { isLoading: isQuizLoading, isError: isQuizError } = useQuery({
    queryKey: ["quiz", params.quizId],
    queryFn: async () => {
      const response = await getQuizQuestions(params.quizId as string);
      if (response.error) {
        toast.error(response.error);
      }
      setQuestions(response.data?.data || []);
      return response.data?.data;
    },
  });

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const response = await deleteQuestion(questionId);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const handleUpdateQuestion = async (
    questionId: number,
    data: UpdateQuizQuestionDto,
  ) => {
    try {
      const response = await updateQuestion(questionId, data);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? response.data?.data! : q)),
      );
    } catch (error) {
      toast.error("Failed to update question");
    }
  };

  const handleAddAnswer = async (questionId: number) => {
    const response = await addAnswer(questionId, {
      answerText: "Answer text",
      isCorrect: false,
    });
    if (response.error) {
      toast.error(response.error);
      return;
    }

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, response.data?.data!],
          };
        }
        return q;
      }),
    );
  };

  const handleDeleteAnswer = async (questionId: number, answerId: number) => {
    const response = await deleteAnswer(answerId);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.filter((a) => a.id !== answerId),
          };
        }
        return q;
      }),
    );
  };

  const handleUpdateAnswer = async (
    questionId: number,
    answerId: number,
    data: Partial<QuizAnswer>,
  ) => {
    const response = await updateAnswer(answerId, data);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, ...data } : a,
            ),
          };
        }
        return q;
      }),
    );
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !questions) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (!reorderedItem) return;

    items.splice(result.destination.index, 0, reorderedItem);

    // Update the orderIndex for each question
    const updatedQuestions = items.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));

    console.log("updatedQuestions", updatedQuestions);

    await updateQuiz(Number(params.lessonId), params.quizId as string, {
      questions: updatedQuestions,
    });

    setQuestions(updatedQuestions);

    // Update the order in the backend
    try {
      setIsLoading(true);
      const response = await updateQuestion(reorderedItem.id, {
        orderIndex: result.destination.index,
      });
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Question order updated");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to update question order");
    }
  };

  if (isQuizLoading || isLessonLoading) return <div>Loading..</div>;
  if (isQuizError || isLessonError) return <div>Error</div>;

  return (
    <div className="container mx-auto space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/courses/${params.courseId}`}>
              {course?.data?.data?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashboard/courses/${params.courseId}/sections/${params.sectionId}`}
            >
              {section?.data?.data?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/dashboard/courses/${params.courseId}/sections/${params.sectionId}/lessons/${params.lessonId}`}
            >
              {lessonData?.data?.data?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Quiz</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 items-center justify-between md:flex">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Quiz</h1>
            <p className="text-muted-foreground">
              Manage quiz questions and answers
            </p>
          </div>
        </div>
        <QuestionDialog
          questionLength={questions.length}
          quizId={params.quizId as string}
          setQuestions={setQuestions}
        />
      </div>

      <div className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions" isDropDisabled={isLoading}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions?.map((question, questionIndex) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id.toString()}
                    index={questionIndex}
                    isDragDisabled={isLoading}
                  >
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Card
                          className={`hover:border-primary/50 shadow-none hover:shadow-sm ${isLoading ? "opacity-50" : ""}`}
                        >
                          <CardHeader className="bg-primary/5 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="text-muted-foreground h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">
                                  Question {questionIndex + 1}:{" "}
                                  {question.questionText}
                                </CardTitle>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4 pt-2">
                              <Accordion type="single" collapsible>
                                <AccordionItem value="title">
                                  <AccordionTrigger className="text-sm font-medium">
                                    Question Details
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <QuestionTitleForm
                                      initialData={{
                                        questionText: question.questionText,
                                      }}
                                      questionId={question.id}
                                    />
                                    <Separator />
                                    <Accordion
                                      type="single"
                                      collapsible
                                      className="w-full"
                                    >
                                      <AccordionItem value="answers">
                                        <AccordionTrigger className="text-sm font-medium">
                                          Answers
                                        </AccordionTrigger>
                                        <AccordionContent>
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-end">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleAddAnswer(question.id)
                                                }
                                                className="gap-2"
                                              >
                                                <Plus className="h-4 w-4" />
                                                Add Answer
                                              </Button>
                                            </div>

                                            <div className="space-y-4">
                                              {question.answers?.map(
                                                (answer, answerIndex) => (
                                                  <div
                                                    key={answer.id}
                                                    className="flex items-start justify-between gap-4 rounded-lg border p-4"
                                                  >
                                                    <AnswerEditForm
                                                      initialData={{
                                                        answerText:
                                                          answer.answerText,
                                                      }}
                                                      answerId={answer.id}
                                                    />
                                                    <div className="flex items-center gap-2 pt-8">
                                                      <div className="flex items-center gap-2">
                                                        <Checkbox
                                                          id={`correct-${answer.id}`}
                                                          checked={
                                                            answer.isCorrect
                                                          }
                                                          onCheckedChange={(
                                                            checked,
                                                          ) =>
                                                            handleUpdateAnswer(
                                                              question.id,
                                                              answer.id,
                                                              {
                                                                isCorrect:
                                                                  checked ===
                                                                  true,
                                                              },
                                                            )
                                                          }
                                                        />
                                                        <Label
                                                          htmlFor={`correct-${answer.id}`}
                                                        >
                                                          Correct
                                                        </Label>
                                                      </div>
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleDeleteAnswer(
                                                            question.id,
                                                            answer.id,
                                                          )
                                                        }
                                                      >
                                                        <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        </AccordionContent>
                                      </AccordionItem>
                                    </Accordion>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {(!questions || questions.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <Plus className="text-primary h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No questions yet</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Add questions to your quiz
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
