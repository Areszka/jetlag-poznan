import { decrypt, encrypt } from "./session";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export async function createAuthCookie(userId: string) {
  const session = await encrypt({ userId });

  return `jetlag_session=${session}; Max-Age=${WEEK_IN_SECONDS}; Path=/; HttpOnly; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`;
}

export async function validateSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    throw new Error("No session cookie");
  }
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("jetlag_session="),
  );
  if (!sessionCookie) {
    throw new Error("No session cookie");
  }
  const session = sessionCookie.replace("jetlag_session=", "");
  const sessionPayload = await decrypt(session);
  return sessionPayload?.userId;
}
