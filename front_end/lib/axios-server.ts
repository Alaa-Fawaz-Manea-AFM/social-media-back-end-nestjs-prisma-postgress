import axios from "axios";
import { cookies } from "next/headers";
import { DOMAIN } from "./axios-client";

export const AxiosServer = async (
  method: "get" | "post" | "delete" | "patch",
  url: string,
  query?: Record<string, unknown>,
  data?: unknown,
) => {
  const cookieStore = await cookies();

  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios({
    method,
    url: `${DOMAIN}${url}`,
    data,
    params: query,
    headers: {
      Cookie: allCookies,
    },
  });
};
