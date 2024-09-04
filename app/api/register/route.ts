import { NextResponse } from "next/server";
import { hash } from "argon2";
import { db } from "../db";
import { createAuthCookie } from "@/app/api/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const passwordHash = await hash(password);
  if (await db.user.findFirst({ where: { username } })) {
    return NextResponse.json(
      {
        error: `User with username ${username} already exists`,
      },
      { status: 400 },
    );
  }
  const { id } = await db.user.create({
    data: { password: passwordHash, username },
  });

  await createAuthCookie(id);
  return NextResponse.json({ username });
}
