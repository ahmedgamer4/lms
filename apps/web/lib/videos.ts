import { UploadVideoDto } from "@lms-saas/shared-lib";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";
import { asyncWrapper } from "./utils";
import axios from "axios";

const baseUrl = `${BACKEND_URL}/lessons/1/videos`;

export interface Video {
  id: string;
  title: string;
  s3Key: string;
}

export type SignedUrlResponse = {
  url: string;
  videoDetails: {
    id: string;
    title: string;
    s3Key: string;
  };
  fields: {
    key: string;
    expiresIn: string;
    bucket: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    Policy: string;
    "X-Amz-Signature": string;
  };
};

export const getPresignedUrl = (lessonId: number, data: UploadVideoDto) => {
  return asyncWrapper(async () => {
    return authFetch<SignedUrlResponse>(
      `${BACKEND_URL}/lessons/${lessonId}/videos/upload`,
      {
        method: "POST",
        data,
      },
    );
  });
};

export const uploadVideo = async (
  file: File,
  presignedPostInput: SignedUrlResponse,
  setProgress: (progress: number) => void,
) => {
  const { url, fields } = presignedPostInput;

  const data: Record<string, any> = {
    ...fields,
    "Content-Type": file.type,
    file,
  };

  const formData = new FormData();
  for (const name in data) formData.append(name, data[name]);

  await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progress) =>
      setProgress((progress.loaded / (progress.total || 1)) * 100),
  });
};

export const deleteVideo = (id: string) => {
  return asyncWrapper(() => {
    return authFetch(`${baseUrl}/${id}`, {
      method: "DELETE",
    });
  });
};

export const getVideo = (id: string) => {
  return asyncWrapper(async () => {
    return authFetch<{ videoId: number; url: string }>(`${baseUrl}/${id}`, {
      method: "GET",
    });
  });
};
