"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourse, findLesson } from "@/lib/courses";
import { useParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Menu,
  VideoOffIcon,
  CheckCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { attempt, cn } from "@/lib/utils";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "./_components/mobile-sidebar";
import { SidebarContent } from "./_components/sidebar-content";
import { VideoPlayer } from "./_components/video-player";
import { lexicalToHtml } from "@/lib/lexical-to-html";
import purify from "dompurify";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { checkIfVideoCompleted, completeVideo } from "@/lib/videos";

export default function LessonPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const courseId = Number(params.courseId);
  const sectionId = Number(params.sectionId);
  const lessonId = Number(params.lessonId);

  const { data: courseResponse, isLoading: courseLoading } = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: async () => {
      const [response, error] = await attempt(getCourse(courseId, true, true));
      if (error) {
        toast.error("Failed to fetch course");
        return;
      }
      return response;
    },
  });

  const { data: lessonResponse, isLoading: lessonLoading } = useQuery({
    queryKey: ["lesson", courseId, sectionId, lessonId],
    queryFn: async () => {
      const [response, error] = await attempt(
        findLesson(courseId, sectionId, lessonId),
      );
      if (error) {
        toast.error("Failed to fetch lesson");
        return;
      }
      return response;
    },
  });

  const course = courseResponse?.data;
  const lesson = lessonResponse?.data;

  const { data: isVideoCompleted, isLoading: isVideoLoading } = useQuery({
    queryKey: ["video-completed", lessonId],
    queryFn: async () => {
      if (!lesson?.videos?.[0]?.id) return { completed: false };

      const [response, error] = await attempt(
        checkIfVideoCompleted(
          lessonId,
          lesson?.videos?.[0]?.id!,
          course?.enrollments?.[0]?.id!,
        ),
      );
      if (error) {
        toast.error("Failed to check if video is completed");
        return;
      }
      return response?.data;
    },
  });

  const handleCompleteVideo = async () => {
    const enrollmentId = course?.enrollments?.[0]?.id;
    if (!enrollmentId) return;

    const [, error] = await attempt(
      completeVideo(lessonId, lesson?.videos?.[0]?.id!, enrollmentId),
    );

    if (error) {
      toast.error("Failed to complete video");
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["video-completed", lessonId],
    });

    toast.success("Video completed");
  };

  const nav = useMemo(() => {
    if (!course) return { prev: null, next: null };
    let prev = null,
      next = null,
      found = false;
    for (const section of course.courseSections || []) {
      for (const l of section.lessons || []) {
        if (found && !next) next = { sectionId: section.id, lessonId: l.id };
        if (l.id === lessonId) found = true;
        if (!found) prev = { sectionId: section.id, lessonId: l.id };
      }
    }
    return { prev, next };
  }, [course, lessonId]);

  if (courseLoading || lessonLoading || isVideoLoading || !course || !lesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Sheet>
      <div className="flex h-full min-h-screen w-full">
        <aside className="bg-muted/60 sticky top-0 hidden h-full overflow-y-auto border-r p-6 md:block">
          <h2 className="text-primary mb-4 text-xl font-semibold">
            {course.title}
          </h2>
          <SidebarContent
            course={course}
            sectionId={sectionId}
            lessonId={lessonId}
          />
        </aside>

        <div className="flex w-full flex-col items-center justify-center px-4 py-2 md:flex-1 md:p-8">
          <div className="mb-2 flex w-full max-w-6xl items-center gap-2">
            <div className="md:hidden">
              <SheetTrigger asChild>
                <Button variant="outline" className="" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
            </div>
            <Link
              href={`/courses`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ArrowLeft className="h-24 w-24" />
              <span>Back to Courses</span>
            </Link>
          </div>

          <div className="bg-muted mb-8 flex aspect-video w-full max-w-6xl items-center justify-center border">
            {lesson.videos?.[0] ? (
              <VideoPlayer lesson={lesson} />
            ) : (
              <VideoOffIcon className="text-muted-foreground h-24 w-24" />
            )}
          </div>
          <div className="border-border mb-8 w-full max-w-6xl rounded-lg border p-4">
            <h1 className="mb-4 text-3xl font-bold">{lesson?.title}</h1>
            {lesson.description && (
              <>
                <Separator className="my-4" />
                <p
                  className="text-lg"
                  dangerouslySetInnerHTML={{
                    __html: purify.sanitize(
                      lexicalToHtml(JSON.parse(lesson.description)),
                    ),
                  }}
                />
              </>
            )}
          </div>

          <div className="mt-auto flex w-full max-w-6xl justify-end gap-4">
            {lesson.videos?.[0] && (
              <Button
                onClick={handleCompleteVideo}
                disabled={isVideoCompleted?.completed}
              >
                {isVideoCompleted?.completed ? (
                  <CheckCircle className="text-primary-foreground h-3 w-3" />
                ) : (
                  <Video className="h-3 w-3" />
                )}
                {isVideoCompleted?.completed ? "Completed" : "Mark Completed"}
              </Button>
            )}
            {nav.prev && (
              <Link
                href={`/courses/${courseId}/sections/${nav.prev.sectionId}/lessons/${nav.prev.lessonId}`}
                className={cn(
                  "hover:bg-muted inline-flex items-center gap-2 rounded border px-4 py-2",
                  buttonVariants({ variant: "outline" }),
                )}
              >
                <ArrowLeft />
              </Link>
            )}
            {nav.next && (
              <Link
                href={`/courses/${courseId}/sections/${nav.next.sectionId}/lessons/${nav.next.lessonId}`}
                className={cn(
                  "hover:bg-muted inline-flex items-center gap-2 rounded border px-4 py-2",
                  buttonVariants({ variant: "outline" }),
                )}
              >
                <ArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
      <MobileSidebar
        course={course}
        sectionId={sectionId}
        lessonId={lessonId}
      />
    </Sheet>
  );
}
