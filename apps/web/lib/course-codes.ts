import { BACKEND_URL } from "./constants";
import { authFetch } from "./auth-fetch";
import { asyncWrapper } from "./utils";
import { CourseCode } from "@lms-saas/shared-lib";

const baseUrl = `${BACKEND_URL}/course-codes`;

export const generateCourseCodes = (courseId: number, quantity: number) => {
  return asyncWrapper(async () => {
    return authFetch<{ message: string }>(`${baseUrl}/generate`, {
      method: "POST",
      data: { courseId, quantity },
    });
  });
};

export const validateCourseCode = (courseId: number, code: string) => {
  return asyncWrapper(async () => {
    return authFetch<{ message: string }>(`${baseUrl}/validate`, {
      method: "POST",
      data: { courseId, code },
    });
  });
};

export const getCourseCodes = (courseId: number) => {
  return asyncWrapper(async () => {
    return authFetch<
      (CourseCode & { student: { name: string; email: string } })[]
    >(`${baseUrl}/course/${courseId}`);
  });
};
