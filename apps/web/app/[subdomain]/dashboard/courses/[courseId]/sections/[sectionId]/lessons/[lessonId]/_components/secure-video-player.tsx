import { useEffect, useRef } from "react";

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
  }, []);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        className={className}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};
