import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/videos";
import { SecureVideoPlayer } from "./secure-video-player";

interface VideoPreviewProps {
  videoId: string;
  title: string;
  onDelete?: () => void;
}

export const VideoPreview = ({
  videoId: s3Key,
  title,
  onDelete,
}: VideoPreviewProps) => {
  const {
    data: url,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["video-url", s3Key],
    queryFn: () =>
      getVideo(s3Key).then((res) => {
        if (res.error || !res.data) throw new Error("Cannot fetch video URL");
        return res.data.data.url;
      }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading video</div>;
  if (!url) return <div>No video URL available</div>;

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <SecureVideoPlayer
          src={url}
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
