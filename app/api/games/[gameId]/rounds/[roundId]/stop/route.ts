import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { PatchRoundResponse } from "../start/route";

export type StopRoundRequest = {
  winnerTeamId: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();
  const endedAt = new Date();

  const { winnerTeamId } = (await request.json()) as StopRoundRequest;

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
      end_time: endedAt,
      winner_id: winnerTeamId,
    },
  });

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
