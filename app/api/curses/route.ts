import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Curse } from "@prisma/client";

export type GetCursesResponse = { curses: Array<Curse> };
export async function GET() {
  const userId = await validateSession();

  const curses = await db.curse.findMany({
    orderBy: {
      defaultDifficulty: "asc",
    },
    where: {
      ownerId: userId,
    },
  });

  return NextResponse.json<GetCursesResponse>({ curses });
}

export type PostCursesRequest = {
  name: string;
  effect: string;
  defaultDifficulty?: number | null;
};
export type PostCursesResponse = { curse: Curse };
export async function POST(request: Request) {
  const { name, effect, defaultDifficulty } = (await request.json()) as PostCursesRequest;

  const userId = await validateSession();

  const newCurse = await db.curse.create({
    data: {
      ownerId: userId,
      name,
      effect,
      defaultDifficulty,
    },
  });

  return NextResponse.json<PostCursesResponse>({ curse: newCurse });
}
