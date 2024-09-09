import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Round } from "@prisma/client";

export type PatchRoundResponse = {
  round: Round;
};
export async function PATCH(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();
  const startedAt = new Date();

  const updatedRound = await db.round.update({
    where: {
      id: params.roundId,
      gameId: params.gameId,
      teams: {
        some: {
          team: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    },
    data: {
      start_time: startedAt,
    },
  });

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
