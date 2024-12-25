import { CreateTeacherDto, LoginUserDto } from "@lms-saas/shared-lib/dtos";
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

export async function loginTeacher(input: LoginUserDto) {
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

export async function refreshToken(
  oldRefreshToken: string
): Promise<string | null> {
  try {
    const res = await axios.post(
      "refresh-token",
      { refreshToken: oldRefreshToken },
      { baseURL: baseUrl }
    );

    const { accessToken, refreshToken: newRefreshToken } = res.data;

    // Update tokens on the server
    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken: newRefreshToken }),
    });

    if (!updateRes.ok) {
      console.error("Failed to update tokens on the server");
      return null;
    }

    return accessToken;
  } catch (error) {
    // Unified error handling
    console.error(
      "Error refreshing token:",
      error instanceof AxiosError
        ? error.response?.data || error.message
        : error
    );
    return null;
  }
}
