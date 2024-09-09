import { headers } from "next/headers";
import { fetchWithBaseUrl } from "./helpers";

export async function serverFetch(url: string, requestInit?: RequestInit) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie") || "";

  return fetchWithBaseUrl(url, {
    ...requestInit,
    headers: {
      Cookie: cookieHeader, // Forward cookies here
    },
  });
}
