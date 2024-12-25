import { BACKEND_URL } from "./constants";
import { authFetch } from "./auth-fetch";
import { SelectCourse } from "@lms-saas/shared-lib/db/schema";
import { asyncWrapper } from "./utils";
import { CreateCourseDto } from "@lms-saas/shared-lib/dtos";

const baseUrl = `${BACKEND_URL}/courses`;

export async function getCoursesByTeacherId(
  published: boolean,
  page?: number,
  limit?: number,
  withTeacher = false
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
