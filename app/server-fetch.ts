import { headers } from "next/headers";

export function serverFetch(url: string, requestInit?: RequestInit) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie") || "";

  return fetchWithBaseUrl(url, {
    ...requestInit,
    headers: {
      Cookie: cookieHeader, // Forward cookies here
    },
  });
}

function fetchWithBaseUrl(url: string, requestInit?: RequestInit) {
  let base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://jetlag-poznan.vercel.app";

  return fetch(`${base_url}${url}`, { ...requestInit });
}
