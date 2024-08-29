export function getBaseUrl(): string {
  let base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://jetlag-poznan.vercel.app";

  return base_url;
}
