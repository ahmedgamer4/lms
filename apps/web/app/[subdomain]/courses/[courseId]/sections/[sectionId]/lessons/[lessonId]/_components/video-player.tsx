import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/videos";
import { Lesson } from "@/lib/courses";
import { Loader2 } from "lucide-react";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";
import { VideoJsPlayer } from "@/components/video-js-player";
export const VideoPlayer = ({ lesson }: { lesson: Lesson }) => {
  const {
    data: videoResponse,
    isLoading: videoLoading,
    isError,
  } = useQuery({
    queryKey: ["video", lesson.id, lesson?.videos[0]?.id],
    queryFn: async () => {
      const [response, error] = await attempt(
        getVideo(lesson.id, lesson?.videos[0]?.id || ""),
      );
      if (error) {
        toast.error("Failed to fetch video URL");
        return;
      }
      return response;
    },
  });

  if (videoLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (isError) return <div>Error loading video</div>;

  return (
    <div className="relative w-full">
      <VideoJsPlayer
        className="h-full w-full"
        src={videoResponse?.data.manifestUrl || ""}
      />
    </div>
  );
};
