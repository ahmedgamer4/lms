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
  CreateLessonDto,
  UpdateCourseSectionDto,
  UpdateLessonDto,
} from "@lms-saas/shared-lib/dtos";
import { Quiz } from "./quizzes";
import { Video } from "./videos";

const baseUrl = `${BACKEND_URL}/courses`;

export type CourseWithEnrollments = SelectCourse & {
  enrollments: {
    id: number;
    progress: number;
    enrolledAt: Date;
  }[];
};

export type CourseWithSectionsAndEnrollments = SelectCourse & {
  courseSections: {
    id: number;
    title: string;
    orderIndex: number;
    lessons: {
      id: number;
      title: string;
      orderIndex: number;
    }[];
  }[];
  enrollments?: {
    id: number;
    progress: number;
    enrolledAt: Date;
  }[];
};

export async function getCoursesByTeacherId(
  published: boolean,
  page?: number,
  limit?: number,
  withTeacher = false,
  withEnrollments = false,
) {
  return asyncWrapper(async () => {
    let url = `${baseUrl}/by-teacher-id?with-teacher=${withTeacher}&published=${published}&with-enrollments=${withEnrollments}`;
    if (page && limit) {
      url += `&page=${page}&limit=${limit}`;
    }
    const response = await authFetch<{
      courses: CourseWithEnrollments[];
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

export async function getCourse(
  id: number,
  withSections = false,
  withEnrollments = false,
) {
  return asyncWrapper(async () => {
    return await authFetch<CourseWithSectionsAndEnrollments>(
      `${baseUrl}/${id}?with-enrollments=${withEnrollments}&with-sections=${withSections}`,
      {
        method: "GET",
      },
    );
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

export type CourseSection = {
  id: number;
  title: string;
  orderIndex: number;
  courseId: number;
  lessons: Lesson[];
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
    return await authFetch<CourseSection>(
      `${baseUrl}/${courseId}/sections/${sectionId}`,
      { method: "GET" },
    );
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

// Lessons
export interface Lesson {
  id: number;
  title: string;
  orderIndex: number;
  videos: Video[];
  quizzes: Quiz[];
  description: string;
}

export const createLesson = (
  courseId: number,
  sectionId: number,
  input: CreateLessonDto,
) => {
  return asyncWrapper(async () => {
    return authFetch<{ id: number }>(
      `${baseUrl}/${courseId}/sections/${sectionId}/lessons`,
      {
        method: "POST",
        data: input,
      },
    );
  });
};

export const updateLesson = (
  courseId: number,
  sectionId: number,
  lessonId: number,
  input: UpdateLessonDto,
) => {
  return asyncWrapper(async () => {
    return authFetch<{ id: number }>(
      `${baseUrl}/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
      {
        method: "PUT",
        data: input,
      },
    );
  });
};

export const findLesson = (
  courseId: number,
  sectionId: number,
  lessonId: number,
) => {
  return asyncWrapper(async () => {
    return await authFetch<Lesson>(
      `${baseUrl}/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
      { method: "GET" },
    );
  });
};

export const deleteLesson = (
  courseId: number,
  sectionId: number,
  lessonId: number,
) => {
  return asyncWrapper(async () => {
    return authFetch<{ id: number }>(
      `${baseUrl}/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
      {
        method: "DELETE",
      },
    );
  });
};

export const enrollInCourse = async (courseId: number) => {
  return asyncWrapper(async () => {
    return authFetch<{ message: string }>(`${baseUrl}/${courseId}/enroll`, {
      method: "POST",
    });
  });
};

export const getEnrolledCourses = async () => {
  return asyncWrapper(async () => {
    return authFetch<CourseWithEnrollments[]>(`${baseUrl}/enrolled`, {
      method: "GET",
    });
  });
};
