import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/videos";
import { SecureVideoPlayer } from "./secure-video-player";

interface VideoPreviewProps {
  lessonId: number;
  videoId: string;
  title: string;
  onDelete?: () => void;
}

export const VideoPreview = ({
  videoId,
  title,
  onDelete,
  lessonId,
}: VideoPreviewProps) => {
  const {
    data: videoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["video-url", videoId],
    queryFn: async () => {
      const response = await getVideo(lessonId, videoId);
      if (!response.data) {
        throw new Error("Failed to fetch video URL");
      }
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading video</div>;
  if (!videoData) return <div>No video data available</div>;

  const video = videoData.data;

  console.log(video);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <SecureVideoPlayer
          src={video.manifestUrl}
          poster="/video-placeholder.png"
          className="h-full w-full"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="text-muted-foreground h-4 w-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Remove Video
          </Button>
        )}
      </div>
    </div>
  );
};
