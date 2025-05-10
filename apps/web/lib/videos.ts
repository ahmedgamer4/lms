import { UploadVideoDto } from "@lms-saas/shared-lib";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";
import { asyncWrapper } from "./utils";
import axios from "axios";

const baseUrl = `${BACKEND_URL}/courses`;

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
      `${baseUrl}/1/sections/1/lessons/${lessonId}/videos/upload`,
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
  console.log("url", url);

  const data: Record<string, any> = {
    ...fields,
    "Content-Type": file.type,
    file,
  };
  console.log("data", data);

  const formData = new FormData();
  for (const name in data) formData.append(name, data[name]);
  console.log("form data", formData);

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
    return authFetch(`${baseUrl}/1/sections/1/lessons/1/videos/${id}`, {
      method: "DELETE",
    });
  });
};

export const getVideo = (id: string) => {
  return asyncWrapper(async () => {
    return authFetch<{ videoId: number; url: string }>(
      `${baseUrl}/1/sections/1/lessons/1/videos/${id}`,
      {
        method: "GET",
      },
    );
  });
};
