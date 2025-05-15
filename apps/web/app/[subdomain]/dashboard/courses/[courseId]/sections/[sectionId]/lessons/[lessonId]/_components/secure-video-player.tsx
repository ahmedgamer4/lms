import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface SecureVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export const SecureVideoPlayer = ({
  src,
  poster,
  className,
}: SecureVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize HLS
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeMaxRetry: 5,
        nudgeOffset: 0.1,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 500,
        levelLoadingTimeOut: 20000,
        levelLoadingMaxRetry: 3,
        levelLoadingRetryDelay: 500,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 3,
        fragLoadingRetryDelay: 500,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Playback failed:", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error:", data);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error:", data);
              hls.recoverMediaError();
              break;
            default:
              console.log("Fatal error:", data);
              hls.destroy();
              break;
          }
        }
      });

      // Cleanup
      return () => {
        hls.destroy();
      };
    }
    // For browsers that natively support HLS (like Safari)
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "c" || e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    video.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      video.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [src]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        poster={poster}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        className={cn(className, "aspect-video")}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};
