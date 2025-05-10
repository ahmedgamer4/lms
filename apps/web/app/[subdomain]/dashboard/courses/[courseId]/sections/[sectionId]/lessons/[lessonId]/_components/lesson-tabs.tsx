import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileQuestion } from "lucide-react";
import { Lesson } from "@/lib/courses";
import { toast } from "sonner";
import { deleteVideo, Video as VideoInterface } from "@/lib/videos";
import { useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoUploader } from "./video-uploader";

type LessonTabsProps = {
  lesson: Lesson;
};

export const LessonTabs = ({ lesson }: LessonTabsProps) => {
  const [lessonVideos, setLessonVideos] = useState(lesson.videos);

  const handleVideoUploadComplete = (video: VideoInterface) => {
    console.log(video);
    setLessonVideos([...lessonVideos, video]);
  };

  const handleVideoDelete = async (videoIndex: number, id: string) => {
    const videoQuery = await deleteVideo(id);
    if (videoQuery.error) {
      toast.error("Cannot remove video");
      return;
    }
    const videos = [...lessonVideos];
    videos.splice(videoIndex, 1);
    setLessonVideos(videos);
  };

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

      <TabsContent value="quizzes"></TabsContent>
    </Tabs>
  );
};
