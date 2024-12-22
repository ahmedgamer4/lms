import axios from "axios";
import { getSession } from "./session";
import { refreshToken } from "./auth";

export async function authFetch<T>(url: string | URL, options?: RequestInit) {
  const session = await getSession();
  const authOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      ...(session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {}),
    },
  };

  let res = await axios({
    url: url.toString(),
    fetchOptions: authOptions,
  });

  if (res.status === 401 && session?.refreshToken) {
    const newAccessToken = await refreshToken(session?.refreshToken);

    if (newAccessToken) {
      authOptions.headers = {
        ...authOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      res = await axios(url.toString(), { fetchOptions: authFetch });
    }
  }
  return res;
}
