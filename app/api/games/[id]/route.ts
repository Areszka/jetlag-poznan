import { db } from "../../db";

import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const game = await db.game.findUnique({
    include: {
      teams: {
        include: {
          members: true,
        },
      },
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(game);
}
