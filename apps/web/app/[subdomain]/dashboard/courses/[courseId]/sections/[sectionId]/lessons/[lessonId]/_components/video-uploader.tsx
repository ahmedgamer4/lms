"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  getPresignedUrl,
  uploadVideo,
  Video as VideoInterface,
} from "@/lib/videos";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { loadFFmpeg } from "@/lib/load-ffmpeg";
import { fetchFile } from "@ffmpeg/util";
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
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFFmpeg();
    ffmpegRef.current = ffmpeg_response;
    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  const compressVideo = async (file: File): Promise<File> => {
    if (!ffmpegRef.current) {
      toast.error("Compression tools not loaded");
      throw new Error("FFmpeg not loaded");
    }

    try {
      setIsCompressing(true);
      setCompressionProgress(0);

      // Write the input file to FFmpeg's virtual filesystem
      await ffmpegRef.current.writeFile("input.mp4", await fetchFile(file));

      // Set up progress monitoring
      ffmpegRef.current.on("progress", ({ progress }) => {
        setCompressionProgress(Math.round(progress * 100));
      });

      // Run FFmpeg command to compress the video
      await ffmpegRef.current.exec([
        "-i",
        "input.mp4",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "32",
        "-maxrate",
        "2M",
        "-bufsize",
        "2M",
        "-movflags",
        "+faststart",
        "-threads",
        "4",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "output.mp4",
      ]);

      try {
        const data = await ffmpegRef.current.readFile("output.mp4");

        if (!data || data.length === 0) {
          throw new Error("Compression resulted in empty file");
        }

        const compressedBlob = new Blob([data], { type: "video/mp4" });

        if (compressedBlob.size === 0) {
          throw new Error("Compression resulted in empty file");
        }

        if (compressedBlob.size >= file.size) {
          console.warn(
            "Compressed file is larger than original, using original file",
          );
          return file;
        }

        return new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, "") + "_compressed.mp4",
          {
            type: "video/mp4",
          },
        );
      } catch (readError) {
        console.error("Error reading compressed file:", readError);
        throw new Error("Failed to read compressed video");
      }
    } catch (error) {
      console.error("Compression error:", error);
      throw new Error("Failed to compress video");
    } finally {
      setIsCompressing(false);
    }
  };

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
    disabled: isUploading || isCompressing || !loaded,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Compress the video first
      const compressedFile = await compressVideo(selectedFile);

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
          {!loaded && (
            <p className="text-muted-foreground text-xs">
              Loading video compression tools...
            </p>
          )}
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
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={!loaded}
            >
              Upload Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
