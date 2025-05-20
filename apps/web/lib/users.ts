import { SelectStudent, SelectTeacher } from "@lms-saas/shared-lib";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";

const baseUrl = BACKEND_URL + "/users";

export const findCurrentUser = () => {
  return authFetch<SelectTeacher | SelectStudent>(`${baseUrl}/current-user`);
};
