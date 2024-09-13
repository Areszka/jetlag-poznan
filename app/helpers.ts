export function getBaseUrl(): string {
  let base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://jetlag-poznan.vercel.app";

  return base_url;
}

export async function fetchWithBaseUrl(url: string, requestInit?: RequestInit) {
  return fetch(`${getBaseUrl()}${url}`, { ...requestInit });
}

export function getTime(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;
  let hh = Math.floor(diff / 1000 / 60 / 60);

  return `${hh < 10 ? "0" : ""}${hh}h ${mm < 10 ? "0" : ""}${mm}m ${ss < 10 ? "0" : ""}${ss}s`;
}

export function timeToMinutesAndSeconds(diff: number) {
  let ss = Math.floor(diff / 1000) % 60;
  let mm = Math.floor(diff / 1000 / 60) % 60;

  return `${mm < 10 ? "0" : ""}${mm}:${ss < 10 ? "0" : ""}${ss}`;
}
