import { db } from "../../db";
import { NextResponse } from "next/server";
import { Game } from "@prisma/client";
import { validateSession } from "@/app/api/auth";

export type GetGameResponse = { game: Game };
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = await validateSession();
  const game = await db.game.findFirstOrThrow({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });

  return NextResponse.json<GetGameResponse>({ game });
}

export type DeleteGamesResponse = { game: Game };
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await validateSession();
  const game = await db.game.delete({
    where: { id: params.id, ownerId: userId },
  });

  return NextResponse.json<DeleteGamesResponse>({ game });
}
