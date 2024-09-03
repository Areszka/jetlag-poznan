import { NextResponse } from "next/server";
import process from "process";
import * as bcrypt from "bcrypt";
import { db } from "../db";
import { createAuthCookie } from "@/app/api/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const passwordHash = await bcrypt.hash(password, 10);
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

  return NextResponse.json(
    { username },
    {
      headers: {
        "Set-Cookie": await createAuthCookie(id),
      },
    },
  );
}