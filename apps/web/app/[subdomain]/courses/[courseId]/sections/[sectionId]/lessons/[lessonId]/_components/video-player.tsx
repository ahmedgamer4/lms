import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/videos";
import { Lesson } from "@/lib/courses";
import { SecureVideoPlayer } from "@/components/secure-video-player";
import { Loader2 } from "lucide-react";

export const VideoPlayer = ({ lesson }: { lesson: Lesson }) => {
  const { data: videoResponse, isLoading: videoLoading } = useQuery({
    queryKey: ["video", lesson.id, lesson?.videos[0]?.id],
    queryFn: () => getVideo(lesson.id, lesson?.videos[0]?.id || ""),
  });

  if (videoLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (videoResponse?.error) return <div>Error loading video</div>;

  return (
    <div className="relative w-full">
      <SecureVideoPlayer
        className="h-full w-full"
        src={videoResponse?.data?.data?.manifestUrl || ""}
      />
    </div>
  );
};
