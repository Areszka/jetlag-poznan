import { db } from "../../db";
import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { User } from "@prisma/client";

export type UserResponse = { user: Omit<User, "password"> };
export async function GET(_: Request, { params }: { params: { username: string } }) {
  await validateSession();
  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  if (user === null) {
    return NextResponse.json(
      { error: `User "${params.username}" does not exist` },
      { status: 400 }
    );
  }

  return NextResponse.json<UserResponse>({
    user: { id: user.id, username: user.username },
  });
}
