import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { TeamRoundCurse } from "@prisma/client";

export type LiftCurseResponse = {
  curse: TeamRoundCurse;
};
export async function POST(
  _request: Request,
  { params }: { params: { curseId: string; createdAt: Date; targetTeamId: string } }
) {
  const userId = await validateSession();

  // Throw if the user is not in the target team or not a hider
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "HIDER",
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      round: {
        end_time: null,
      },
    },
  });

  const curse = await db.teamRoundCurse.update({
    where: {
      roundId_curseId_teamId_created_at: {
        curseId: params.curseId,
        teamId: params.targetTeamId,
        roundId: lastRound.roundId,
        created_at: params.createdAt,
      },
    },
    data: {
      lifted_at: new Date(),
    },
  });

  if (!curse) {
    return NextResponse.json(
      {
        error: `No curse with id ${params.curseId} on team ${lastRound.teamId} found for active round`,
      },
      { status: 400 }
    );
  }

  return NextResponse.json<LiftCurseResponse>({
    curse,
  });
}
