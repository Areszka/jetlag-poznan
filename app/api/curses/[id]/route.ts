import { Curse } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";

export type PutCursesRequest = {
  name: string;
  effect: string;
  defaultDifficulty: number;
};
export type PutCursesResponse = { curse: Curse };
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { name, effect, defaultDifficulty } =
    (await request.json()) as PutCursesRequest;

  const userId = await validateSession();

  const updatedCurse = await db.curse.update({
    where: {
      id: params.id,
      ownerId: userId,
    },
    data: {
      name,
      effect,
      defaultDifficulty,
    },
  });

  return NextResponse.json<PutCursesResponse>({ curse: updatedCurse });
}

export type DeleteCursesResponse = { curse: Curse };
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await validateSession();

  const deletedCurse = await db.curse.delete({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });

  return NextResponse.json<DeleteCursesResponse>({ curse: deletedCurse });
}
