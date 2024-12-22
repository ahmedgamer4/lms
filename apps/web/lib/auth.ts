import { CreateTeacherDto, LoginTeacherDto } from "@lms-saas/shared-lib/dtos";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "./constants";
import { createSession } from "./session";

const baseUrl = `${BACKEND_URL}/auth`;

export async function signupTeacher(input: CreateTeacherDto) {
  try {
    return await axios.post(`teacher/register`, input, {
      baseURL: baseUrl,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) return error.response;
  }
}

export async function loginTeacher(input: LoginTeacherDto) {
  try {
    const res = await axios.post(`teacher/login`, input, {
      baseURL: baseUrl,
    });
    if (res.status === 200)
      await createSession({
        user: {
          id: res.data.id,
          name: res.data.name,
          role: res.data.role,
          subdomain: res.data.subdomain,
        },
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
    return res;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) return error.response;
  }
}

export async function refreshToken(oldRefreshToken: string) {
  try {
    const res = await axios.post(
      "refresh-token",
      {
        refreshToken: oldRefreshToken,
      },
      { baseURL: baseUrl }
    );

    const { accessToken, refreshToken } = res.data;
    try {
      const res = await fetch("http://localhost:3000/api/auth/update", {
        method: "POST",
        body: JSON.stringify({ accessToken, refreshToken }),
      });
      if (!res.ok) throw new Error("Failed to refresh token");
      return accessToken;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    if (error instanceof AxiosError) return error.response;
  }
}
