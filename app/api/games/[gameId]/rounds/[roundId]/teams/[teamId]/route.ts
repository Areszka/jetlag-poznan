import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { Team, TeamRound } from "@prisma/client";

export type GetTeamResponse = { team: Team & TeamRound };

export async function GET(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string; teamId: string } }
) {
  await validateSession();

  const team = await db.teamRound.findFirstOrThrow({
    where: {
      roundId: params.roundId,
      round: {
        gameId: params.gameId,
      },
      teamId: params.teamId,
    },
    include: {
      team: true,
    },
  });

  return NextResponse.json<GetTeamResponse>({
    team: { ...team, ...team.team },
  });
}
