import { SelectStudent, SelectTeacher } from "@lms-saas/shared-lib";
import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";
import { asyncWrapper } from "./utils";

const baseUrl = BACKEND_URL + "/users";

export const findCurrentUser = () => {
  return asyncWrapper(() =>
    authFetch<SelectTeacher | SelectStudent>(`${baseUrl}/current-user`),
  );
};
