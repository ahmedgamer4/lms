import { BACKEND_URL } from "./constants";
import { authFetch } from "./auth-fetch";
import {
  SelectCourse,
  SelectCourseSection,
} from "@lms-saas/shared-lib/db/schema";
import { asyncWrapper } from "./utils";
import {
  CourseEditDto,
  CreateCourseDto,
  CreateCourseSectionDto,
  UpdateCourseSectionDto,
} from "@lms-saas/shared-lib/dtos";
import { z } from "zod";

const baseUrl = `${BACKEND_URL}/courses`;

export async function getCoursesByTeacherId(
  published: boolean,
  page?: number,
  limit?: number,
  withTeacher = false,
) {
  return asyncWrapper(async () => {
    let url = `${baseUrl}/by-teacher-id?with-teacher=${withTeacher}&published=${published}`;
    if (page && limit) {
      url += `&page=${page}&limit=${limit}`;
    }
    const response = await authFetch<{
      courses: SelectCourse[];
      count: number;
    }>(url);
    return response.data;
  });
}

export async function createCourse(input: CreateCourseDto) {
  return asyncWrapper(async () => {
    await authFetch<void>(baseUrl, { method: "POST", data: input });
  });
}

export async function getCourse(id: number) {
  return asyncWrapper(async () => {
    return await authFetch<
      SelectCourse & {
        courseSections: { id: number; title: string; orderIndex: number }[];
      }
    >(`${baseUrl}/${id}`, { method: "GET" });
  });
}

export async function updateCourse(id: number, input: CourseEditDto) {
  return asyncWrapper(async () => {
    await authFetch<void>(`${baseUrl}/${id}`, { method: "PUT", data: input });
  });
}

export function deleteCourse(id: number) {
  return asyncWrapper(async () => {
    await authFetch(`${baseUrl}/${id}`, { method: "DELETE" });
  });
}

export const courseFormSchema = z.object({
  id: z.number().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  price: z.string().min(0, "Price cannot be negative").optional(),
  published: z.boolean(),
});

export const sectionSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Section title is required"),
  orderIndex: z.number(),
  videos: z.array(
    z.object({
      id: z.number().optional(),
      title: z.string().min(1, "Video title is required"),
      videoUrl: z.string().url("Please enter a valid video URL"),
      orderIndex: z.number(),
    }),
  ),
  quizzes: z.array(
    z.object({
      id: z.number().optional(),
      title: z.string().min(1, "Quiz title is required"),
      duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
      orderIndex: z.number(),
      questions: z.array(
        z.object({
          id: z.number().optional(),
          questionText: z.string().min(1, "Question text is required"),
          orderIndex: z.number(),
          answers: z.array(
            z.object({
              id: z.number().optional(),
              answerText: z.string().min(1, "Answer text is required"),
              isCorrect: z.boolean(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type CourseSection = {
  id: number;
  title: string;
  orderIndex: number;
  courseId: number;
};

export const createCourseSection = (
  courseId: number,
  input: CreateCourseSectionDto,
) => {
  return asyncWrapper(async () => {
    return await authFetch<Omit<CourseSection, "courseId">[]>(
      `${baseUrl}/${courseId}/sections`,
      {
        method: "POST",
        data: input,
      },
    );
  });
};

export const updateCourseSection = (
  courseId: number,
  sectionId: number,
  input: UpdateCourseSectionDto,
) => {
  return asyncWrapper(async () => {
    await authFetch<void>(`${baseUrl}/${courseId}/sections/${sectionId}`, {
      method: "PUT",
      data: input,
    });
  });
};

export const getCourseSections = (courseId: number) => {
  return asyncWrapper(async () => {
    return await authFetch<SelectCourseSection[]>(
      `${baseUrl}/${courseId}/sections`,
      { method: "GET" },
    );
  });
};

export const findCourseSection = (courseId: number, sectionId: number) => {
  return asyncWrapper(async () => {
    return await authFetch<
      SelectCourseSection & {
        videos: {
          id: number;
          title: string;
          s3Key: string;
          orderIndex: number;
        }[];
      }
    >(`${baseUrl}/${courseId}/sections/${sectionId}`, { method: "GET" });
  });
};

export const deleteCourseSection = (courseId: number, sectionId: number) => {
  return asyncWrapper(async () => {
    await authFetch<void>(`${baseUrl}/${courseId}/sections/${sectionId}`, {
      method: "DELETE",
    });
  });
};

export const uploadCoverImage = async (courseId: number, file: File) => {
  const formData = new FormData();
  formData.append("coverImage", file);

  return asyncWrapper(async () => {
    await authFetch<void>(`${baseUrl}/${courseId}/upload-cover-image`, {
      method: "PUT",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  });
};
