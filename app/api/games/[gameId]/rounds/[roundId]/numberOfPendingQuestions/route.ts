import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";

export type GetPendingQuestionsResponse = { pendingQuestions: number };
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

  const pendingQuestions = await db.teamRoundQuestion.count({
    where: {
      roundId: params.roundId,
      round: {
        gameId: params.gameId,
      },
      created_at: {
        not: undefined,
      },
      answer: null,
      teamId: userTeam.role === "SEEKER" ? userTeam.teamId : { not: undefined },
    },
  });

  return NextResponse.json<GetPendingQuestionsResponse>({ pendingQuestions });
}
