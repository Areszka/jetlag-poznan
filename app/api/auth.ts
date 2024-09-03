import { redirect } from "next/navigation";
import { decrypt, encrypt } from "./session";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export async function createAuthCookie(userId: string) {
  const session = await encrypt({ userId });

  return `jetlag_session=${session}; Max-Age=${WEEK_IN_SECONDS}; Path=/; HttpOnly; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`;
}

export async function validateSession(session: string | undefined) {
  const sessionPayload = await decrypt(session);

  const userId = sessionPayload?.userId;

  if (!userId) {
    return redirect("/login");
  } else {
    return userId;
  }

  // return userId;
}

export function getSessionCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return undefined;
  }
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("jetlag_session="));
  if (!sessionCookie) {
    return undefined;
  }
  const session = sessionCookie.replace("jetlag_session=", "");
  return session;
}
