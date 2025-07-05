import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  checkIfLessonCompleted,
  CourseWithSectionsAndEnrollments,
  findLesson,
  Lesson,
} from "@/lib/courses";
import { useQuery } from "@tanstack/react-query";
import { attempt, cn } from "@/lib/utils";
import {
  FileText,
  Loader2,
  Video,
  PlayCircle,
  BookOpen,
  Circle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { checkIfVideoCompleted } from "@/lib/videos";
import { checkIfQuizCompleted } from "@/lib/quizzes";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface SidebarContentProps {
  course: CourseWithSectionsAndEnrollments;
  lessonId: number;
}

interface LessonItemProps {
  lesson: Omit<Lesson, "description">;
  courseId: number;
  sectionId: number;
  lessonId: number;
  enrollmentId: number;
}

interface SectionAccordionProps {
  section: {
    id: number;
    title: string;
    orderIndex: number;
    courseId: number;
    lessons: Omit<Lesson, "description">[];
  };
  courseId: number;
  lessonId: number;
  enrollmentId: number;
}

const generateLessonUrl = (
  courseId: number,
  sectionId: number,
  lessonId: number,
) => `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`;

const generateQuizUrl = (courseId: number, quizId: string) =>
  `/courses/${courseId}/quiz/${quizId}`;

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Loading course content...
        </p>
      </div>
    </div>
  );
}

function LessonResources({
  lesson,
  courseId,
  enrollmentId,
  sectionId,
  lessonId,
}: {
  lesson: Omit<Lesson, "description">;
  courseId: number;
  enrollmentId: number;
  sectionId: number;
  lessonId: number;
}) {
  const hasVideos = lesson.videos && lesson.videos.length > 0;
  const hasQuizzes = lesson.quizzes && lesson.quizzes.length > 0;

  const videoId = lesson.videos?.[0]?.id;
  const quizId = lesson.quizzes?.[0]?.id;

  if (!hasVideos && !hasQuizzes) return null;

  const { data: isVideoCompleted, isLoading: isVideoLoading } = useQuery({
    queryKey: ["video-completed", lesson.id],
    queryFn: async () => {
      if (!videoId) return { completed: false };

      const [response, error] = await attempt(
        checkIfVideoCompleted(lessonId, videoId, enrollmentId),
      );
      if (error || !response) {
        throw error || new Error("Failed to check if lesson is completed");
      }
      return response?.data;
    },
  });

  const { data: isQuizCompleted, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quiz-completed", lesson.id],
    queryFn: async () => {
      if (!quizId) return { completed: false };

      const [response, error] = await attempt(
        checkIfQuizCompleted(quizId, enrollmentId),
      );
      if (error || !response) {
        throw error || new Error("Failed to check if lesson is completed");
      }
      return response.data;
    },
  });

  if (isVideoLoading || isQuizLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="text-muted-foreground mb-2 text-xs font-medium">
        Lesson Resources
      </div>
      <div className="flex flex-col gap-2">
        {hasVideos && (
          <Button
            className={cn(
              !!isVideoCompleted?.completed &&
                "border-green-600 bg-green-100 hover:bg-green-200/80",
              "h-8 w-full justify-start gap-2 text-sm",
            )}
            variant="outline"
            size="sm"
          >
            {isVideoCompleted?.completed ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <Video className="h-3 w-3" />
            )}
            <span>Watch Video</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {lesson.videos?.length || 0}
            </Badge>
          </Button>
        )}
        {hasQuizzes && (
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 w-full justify-start gap-2 text-sm",
              !!isQuizCompleted?.completed &&
                "border-green-600 bg-green-100 hover:bg-green-200/80",
            )}
            href={generateQuizUrl(courseId, quizId!)}
          >
            {isQuizCompleted?.completed ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <FileText className="h-3 w-3" />
            )}
            <span>Take Quiz</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {lesson.quizzes?.length || 0}
            </Badge>
          </Link>
        )}
      </div>
    </div>
  );
}

function LessonItem({
  lesson,
  courseId,
  sectionId,
  enrollmentId,
}: LessonItemProps) {
  const { lessonId } = useParams();
  const isActive = lesson.id === Number(lessonId);
  const lessonUrl = generateLessonUrl(courseId, sectionId, lesson.id);

  const { data: isLessonCompleted, isLoading: isLessonCompletedLoading } =
    useQuery({
      queryKey: ["lesson-completed", lesson.id],
      queryFn: async () => {
        const [response, error] = await attempt(
          checkIfLessonCompleted(courseId, sectionId, lesson.id, enrollmentId),
        );

        if (error || !response) {
          toast.error("Failed to check if lesson is completed");
          return { completed: false };
        }

        return response.data;
      },
    });

  if (isLessonCompletedLoading || !lesson) {
    return <LoadingSpinner />;
  }

  return (
    <li key={lesson.id} className="relative">
      <Link
        href={lessonUrl}
        className={cn(
          "group hover:bg-accent/50 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
          isActive
            ? "bg-primary/10 border-primary/20 text-primary border font-medium"
            : "text-foreground/80 hover:text-foreground",
        )}
      >
        <div className="bg-muted/50 group-hover:bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full transition-colors">
          {isLessonCompleted?.completed ? (
            <CheckCircle className="h-3 w-3 text-green-600" />
          ) : isActive ? (
            <PlayCircle className="text-primary h-3 w-3" />
          ) : (
            <Circle className="text-muted-foreground group-hover:text-primary h-3 w-3 transition-colors" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{lesson.title}</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>Lesson {lesson.orderIndex + 1}</span>
            </div>
          </div>
        </div>
        {isActive && <div className="bg-primary h-6 w-1 rounded-full" />}
      </Link>
      {isActive && (
        <div className="mt-2 ml-9">
          <LessonResources
            lesson={lesson}
            courseId={courseId}
            enrollmentId={enrollmentId}
            sectionId={sectionId}
            lessonId={Number(lessonId)}
          />
        </div>
      )}
    </li>
  );
}

function SectionAccordion({
  section,
  courseId,
  lessonId,
  enrollmentId,
}: SectionAccordionProps) {
  const { sectionId } = useParams();
  const isCurrentSection = section.id.toString() === sectionId;
  const defaultValue = isCurrentSection ? section.id.toString() : undefined;
  const hasActiveLesson = section.lessons?.some(
    (lesson) => lesson.id === lessonId,
  );

  return (
    <Card
      key={section.id}
      className={cn(
        "border-0 shadow-sm",
        isCurrentSection && "ring-primary/20 bg-primary/5 ring-2",
      )}
    >
      <Accordion defaultValue={defaultValue} type="single" collapsible>
        <AccordionItem value={section.id.toString()} className="border-0">
          <AccordionTrigger
            className={cn(
              "px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180",
              isCurrentSection && "text-primary font-semibold",
            )}
          >
            <div className="flex flex-1 items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isCurrentSection
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground",
                )}
              >
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{section.title}</div>
                <div className="text-muted-foreground mt-0.5 text-xs">
                  {section.lessons?.length || 0} lessons
                </div>
              </div>
              {hasActiveLesson && (
                <Badge variant="default" className="mr-1.5 text-xs">
                  Current
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="list-none space-y-3">
              {section.lessons?.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  courseId={courseId}
                  sectionId={section.id}
                  lessonId={lesson.id}
                  enrollmentId={enrollmentId}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export function SidebarContent({ course, lessonId }: SidebarContentProps) {
  return (
    <div className="space-y-3 p-1">
      <div className="px-2 py-3">
        <h2 className="text-foreground mb-1 text-lg font-semibold">
          Course Content
        </h2>
        <p className="text-muted-foreground text-sm">
          {course.courseSections?.length || 0} sections •{" "}
          {course.courseSections?.reduce(
            (total, section) => total + (section.lessons?.length || 0),
            0,
          ) || 0}{" "}
          lessons
        </p>
      </div>

      <div className="space-y-3">
        {course.courseSections?.map((section) => (
          <SectionAccordion
            key={section.id}
            enrollmentId={course.enrollments?.[0]?.id!}
            section={{ ...section, courseId: course.id }}
            courseId={course.id}
            lessonId={lessonId}
          />
        ))}
      </div>
    </div>
  );
}
