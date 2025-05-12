"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  getPresignedUrl,
  uploadVideo,
  Video as VideoInterface,
} from "@/lib/videos";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const VideoUploader = ({
  lessonId,
  onUploadComplete,
}: {
  lessonId: number;
  onUploadComplete: (video: VideoInterface) => void;
}) => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      return toast.error("Please upload a video file");
    }
    if (file.size > 500 * 1024 * 1024) {
      return toast.error("File size must be less than 500MB");
    }
    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi", ".wmv"] },
    maxFiles: 1,
    disabled: isUploading || isCompressing,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Compress the video first
      const compressedFile = selectedFile;

      const { data, error } = await getPresignedUrl(lessonId, {
        title: compressedFile.name,
      });
      if (error || !data) throw new Error("Failed to get upload URL");

      await uploadVideo(compressedFile, data.data, setUploadProgress);

      const details = data.data.videoDetails;
      onUploadComplete({
        id: details.id,
        title: details.title,
        s3Key: details.s3Key,
      });

      queryClient.invalidateQueries({ queryKey: ["video-url", details.id] });

      toast.success("Video uploaded successfully");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            {isDragActive
              ? "Drop the video here"
              : "Drag & drop a video, or click to select"}
          </p>
          <p className="text-muted-foreground text-xs">
            Supported: MP4, MOV, AVI, WMV (max 500MB)
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-muted-foreground text-xs">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading || isCompressing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isCompressing ? (
            <div className="space-y-2">
              <Progress value={compressionProgress} />
              <p className="text-muted-foreground text-center text-xs">
                Compressing... {compressionProgress}%
              </p>
            </div>
          ) : isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-muted-foreground text-center text-xs">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              Upload Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
