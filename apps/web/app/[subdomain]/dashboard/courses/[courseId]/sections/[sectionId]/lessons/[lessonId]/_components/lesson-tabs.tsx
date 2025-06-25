import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileQuestion, Trash2, Loader2 } from "lucide-react";
import { Lesson } from "@/lib/courses";
import { toast } from "sonner";
import { deleteVideo, Video as VideoInterface } from "@/lib/videos";
import { useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoUploader } from "./video-uploader";
import { Button } from "@/components/ui/button";
import { Quiz, deleteQuiz, findQuiz } from "@/lib/quizzes";
import { CreateQuizDialog } from "./create-quiz-dialog";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { attempt } from "@/lib/utils";

type LessonTabsProps = {
  lesson: Lesson;
};

export const LessonTabs = ({ lesson }: LessonTabsProps) => {
  const params = useParams();
  const router = useRouter();
  const [lessonVideos, setLessonVideos] = useState(lesson.videos);
  const [lessonQuizzes, setLessonQuizzes] = useState(lesson.quizzes);

  const {
    data: quizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
  } = useQuery({
    queryKey: ["quiz", lesson.quizzes[0]?.id],
    queryFn: async () => {
      if (!lesson.quizzes[0]?.id) {
        return { questions: [] };
      }
      const [response, error] = await attempt(findQuiz(lesson.quizzes[0]?.id));
      if (error) {
        toast.error(error.message);
        return { questions: [] };
      }
      return response.data;
    },
  });

  const handleVideoUploadComplete = (video: VideoInterface) => {
    setLessonVideos([...lessonVideos, video]);
  };

  const handleVideoDelete = async (videoIndex: number, id: string) => {
    if (!id) return;
    const [, error] = await attempt(deleteVideo(lesson.id, id));
    if (error) {
      toast.error("Cannot remove video");
      return;
    }
    const videos = [...lessonVideos];
    videos.splice(videoIndex, 1);
    setLessonVideos(videos);
  };

  const handleQuizDelete = async (quizIndex: number, id: string) => {
    const [, error] = await attempt(deleteQuiz(lesson.id, id));
    if (error) {
      toast.error("Cannot remove quiz");
      return;
    }
    const quizzes = [...lessonQuizzes];
    quizzes.splice(quizIndex, 1);
    setLessonQuizzes(quizzes);
    toast.success("Quiz removed successfully");
  };

  const handleQuizCreated = (quiz: Quiz) => {
    setLessonQuizzes([...lessonQuizzes, quiz]);
  };

  if (isQuizLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isQuizError) return <div>Error</div>;

  return (
    <Tabs defaultValue="videos" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="videos" className="gap-2">
          <Video className="h-4 w-4" />
          Video
        </TabsTrigger>
        <TabsTrigger value="quizzes" className="gap-2">
          <FileQuestion className="h-4 w-4" />
          Quiz
        </TabsTrigger>
      </TabsList>

      <TabsContent value="videos">
        <div className="space-y-4">
          {lessonVideos.map((video, videoIndex) => (
            <VideoPreview
              key={`video-${video.id}`}
              lessonId={lesson.id}
              videoId={video.id}
              title={video.title}
              onDelete={() => handleVideoDelete(videoIndex, video.id)}
            />
          ))}

          {lessonVideos.length === 0 && (
            <VideoUploader
              lessonId={lesson.id}
              onUploadComplete={handleVideoUploadComplete}
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="quizzes">
        <div className="space-y-4">
          {lessonQuizzes?.map((quiz, quizIndex) => (
            <div
              key={`quiz-${quiz.id}`}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <FileQuestion className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {quizData?.questions.length || 0} questions •{" "}
                    {quiz.duration} minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/dashboard/courses/${params.courseId}/sections/${params.sectionId}/lessons/${params.lessonId}/quizzes/${quiz.id}`,
                    )
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-destructive/10 hover:text-destructive"
                  size="icon"
                  onClick={() => handleQuizDelete(quizIndex, quiz.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {lessonQuizzes?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <FileQuestion className="text-primary h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No quizzes yet</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Create a quiz to test your students' knowledge
              </p>
              <CreateQuizDialog
                quizzesNumber={lessonQuizzes.length || 0}
                lessonId={lesson.id}
                onQuizCreated={handleQuizCreated}
              />
            </div>
          ) : (
            <div className="flex justify-end">
              <CreateQuizDialog
                quizzesNumber={lessonQuizzes.length || 0}
                lessonId={lesson.id}
                onQuizCreated={handleQuizCreated}
              />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
