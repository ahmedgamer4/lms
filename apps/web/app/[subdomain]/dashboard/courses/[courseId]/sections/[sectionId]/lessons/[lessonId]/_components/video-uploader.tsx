"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createVideo,
  getUploadPresignedUrl,
  uploadVideo,
  Video as VideoInterface,
} from "@/lib/videos";
import { transcodeToHLS } from "@/lib/transcode-video";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useCallback } from "react";
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
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcodingProgress, setTranscodingProgress] = useState(0);
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
    disabled: isUploading || isTranscoding,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsTranscoding(true);
      setTranscodingProgress(0);

      // Transcode the video to HLS
      let manifest: File;
      let segments: File[];
      try {
        const { manifest: manifestFile, segments: segmentsFiles } =
          await transcodeToHLS(selectedFile, setTranscodingProgress);
        manifest = manifestFile;
        segments = segmentsFiles;
      } catch (error) {
        console.error(error);
        toast.error("Failed to transcode video");
        setIsTranscoding(false);
        return;
      }

      setIsTranscoding(false);
      setIsUploading(true);
      setUploadProgress(0);

      const videoDetails = await createVideo(lessonId, {
        title: manifest.name,
      });

      if (videoDetails.error || !videoDetails.data)
        throw new Error("Failed to create video");

      const { data: manifestUploadData, error: manifestUploadError } =
        await getUploadPresignedUrl(lessonId, {
          key: videoDetails.data.data.manifestKey,
          contentType: manifest.type,
          expiresIn: 60 * 60 * 1000,
        });

      if (manifestUploadError || !manifestUploadData)
        throw new Error("Failed to get upload URL");

      // Upload manifest
      await uploadVideo(manifest, manifestUploadData.data, setUploadProgress);

      // Upload segments
      const segmentPromises = segments.map(async (segment, index) => {
        // Create a new File object with the correct content type
        const segmentFile = new File([segment], segment.name, {
          type: "video/mp2t",
        });

        const { data: segmentUploadData, error: segmentUploadError } =
          await getUploadPresignedUrl(lessonId, {
            key: `${videoDetails.data.data.segmentsKey}/${segment.name}`,
            contentType: "video/mp2t",
            expiresIn: 60 * 60 * 1000,
          });

        if (segmentUploadError || !segmentUploadData)
          throw new Error("Failed to get segment upload URL");

        await uploadVideo(segmentFile, segmentUploadData.data, () => {
          const segmentProgress = ((index + 1) / segments.length) * 100;
          setUploadProgress(segmentProgress);
        });
      });

      await Promise.all(segmentPromises);

      const details = videoDetails.data.data;
      onUploadComplete({
        id: details.id,
        title: details.title,
        manifestKey: details.manifestKey,
        segmentsKey: details.segmentsKey,
      });

      queryClient.invalidateQueries({ queryKey: ["video-url", details.id] });

      toast.success("Video uploaded successfully");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload video");
    } finally {
      setIsUploading(false);
      setIsTranscoding(false);
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
              disabled={isUploading || isTranscoding}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isTranscoding ? (
            <div className="space-y-2">
              <Progress value={transcodingProgress} />
              <p className="text-muted-foreground text-center text-xs">
                Transcoding... {transcodingProgress}%
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
