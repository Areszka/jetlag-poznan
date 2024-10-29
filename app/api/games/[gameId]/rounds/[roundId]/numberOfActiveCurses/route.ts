import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";

export type GetActiveCursesResponse = { activeCurses: number };
export async function GET(
  _request: Request,
  { params }: { params: { roundId: string; gameId: string } }
) {
  const userId = await validateSession();
  const userTeam = await db.teamRound.findFirstOrThrow({
    where: {
      roundId: params.roundId,
      round: {
        gameId: params.gameId,
      },
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    },
  });

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const activeCurses = await db.teamRoundCurse.count({
    where: {
      roundId: params.roundId,
      round: {
        gameId: params.gameId,
      },
      created_at: {
        not: undefined,
      },
      lifted_at: null,
      OR: [{ vetoed_at: null }, { vetoed_at: { gt: fifteenMinutesAgo } }],
      teamId: userTeam.role === "SEEKER" ? userTeam.teamId : { not: undefined },
    },
  });

  return NextResponse.json<GetActiveCursesResponse>({ activeCurses });
}
