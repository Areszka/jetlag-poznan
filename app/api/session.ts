import process from "process";
import { jwtVerify, SignJWT } from "jose";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET must be set");
}

const encodedKey = new TextEncoder().encode(secret);

export async function encrypt(payload: { userId: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<{ userId: string }>(
      session,
      encodedKey,
      {
        algorithms: ["HS256"],
      },
    );
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}
