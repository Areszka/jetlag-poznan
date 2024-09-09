import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { PatchRoundResponse } from "../start/route";

export async function PATCH(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();
  const endedAt = new Date();

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
    },
  });

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
