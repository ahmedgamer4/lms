import { BACKEND_URL } from "./constants";
import { authFetch } from "./auth-fetch";
import { asyncWrapper } from "./utils";
import { CourseCode } from "@lms-saas/shared-lib";

const baseUrl = `${BACKEND_URL}`;

export const generateCourseCodes = (courseId: number, quantity: number) => {
  return asyncWrapper(async () => {
    return authFetch<{ message: string }>(
      `${baseUrl}/courses/${courseId}/course-codes/generate`,
      {
        method: "POST",
        data: { quantity },
      },
    );
  });
};

export const validateCourseCode = (courseId: number, code: string) => {
  return asyncWrapper(async () => {
    return authFetch<{ message: string }>(
      `${baseUrl}/courses/${courseId}/course-codes/validate`,
      {
        method: "POST",
        data: { code },
      },
    );
  });
};

export const getCourseCodes = (courseId: number) => {
  return asyncWrapper(async () => {
    return authFetch<
      (CourseCode & { student: { name: string; email: string } })[]
    >(`${baseUrl}/courses/${courseId}/course-codes`);
  });
};
