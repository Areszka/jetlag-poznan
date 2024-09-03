import { NextResponse } from "next/server";
import { verify } from "argon2";
import { db } from "../db";
import { createAuthCookie } from "@/app/api/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const user = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        error: `User not found`,
      },
      { status: 404 }
    );
  }

  const isCorrectPassword = await verify(user.password, password);
  if (!isCorrectPassword) {
    return NextResponse.json(null, { status: 401, statusText: `Incorrect password` });
  }

  return NextResponse.json(user, {
    headers: {
      "Set-Cookie": await createAuthCookie(user.id),
    },
  });
}
