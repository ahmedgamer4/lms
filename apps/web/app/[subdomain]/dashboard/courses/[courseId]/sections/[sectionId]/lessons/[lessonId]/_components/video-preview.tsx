import { Loader2, Trash, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "@/lib/videos";
import { VideoJsPlayer } from "@/components/video-js-player";
import { attempt } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
      const [response, error] = await attempt(getVideo(lessonId, videoId));
      if (error) {
        toast.error("Failed to fetch video URL");
        return;
      }
      return response;
    },
  });

  const t = useTranslations("lessons");
  const tCommon = useTranslations("common");

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div>{tCommon("somethingWentWrong")}</div>;
  if (!videoData) return <div>{tCommon("somethingWentWrong")}</div>;

  const video = videoData.data;

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <VideoJsPlayer
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
            <Trash className="mr-2 h-4 w-4" />
            {tCommon("delete")} {t("video")}
          </Button>
        )}
      </div>
    </div>
  );
};
