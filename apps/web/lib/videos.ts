import { UploadVideoDto } from "@lms-saas/shared-lib";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";
import { asyncWrapper } from "./utils";
import axios from "axios";

const baseUrl = `${BACKEND_URL}/courses`;

export interface Video {
  id: number;
  title: string;
  s3Key: string;
}

export type SignedUrlResponse = {
  url: string;
  videoDetails: {
    id: number;
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

  await fetch(url, {
    method: "POST",
    body: formData,
  });
};

export const deleteVideo = (videoId: number) => {
  return asyncWrapper(() => {
    return authFetch(`${baseUrl}/1/sections/1/lessons/1/videos/${videoId}`, {
      method: "DELETE",
    });
  });
};

export const getVideo = (videoId: number) => {
  return asyncWrapper(async () => {
    return authFetch<{ videoId: number; url: string }>(
      `${baseUrl}/1/sections/1/lessons/1/videos/${videoId}`,
      {
        method: "GET",
      },
    );
  });
};
