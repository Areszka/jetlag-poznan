import { NextResponse } from "next/server";
import { verify } from "argon2";
import { db } from "../db";
import { createAuthCookie } from "@/app/api/auth";
import { User } from "@prisma/client";

export type LoginRequest = {
  username: string;
  password: string;
};
export type LoginResponse = {
  user: Omit<User, "password">;
};
export async function POST(request: Request) {
  const { username, password } = (await request.json()) as LoginRequest;

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
      { status: 404 },
    );
  }

  const isCorrectPassword = await verify(user.password, password);
  if (!isCorrectPassword) {
    return NextResponse.json(null, {
      status: 401,
      statusText: `Incorrect password`,
    });
  }
  await createAuthCookie(user.id);
  return NextResponse.json<LoginResponse>({
    user: { id: user.id, username: user.username },
  });
}
