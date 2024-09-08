import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Question, TeamRoundQuestion } from "@prisma/client";

export type AskQuestionResponse = {
  question: TeamRoundQuestion & { question: Question };
};
export async function POST(
  _request: Request,
  { params }: { params: { questionId: string } },
) {
  const userId = await validateSession();

  // Throw if the user is not in the target team or not a seeker
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "SEEKER",
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

  const question = await db.teamRoundQuestion.create({
    data: {
      teamId: lastRound.teamId,
      roundId: lastRound.roundId,
      questionId: params.questionId,
    },
    include: {
      question: true,
    },
  });

  return NextResponse.json<AskQuestionResponse>({
    question,
  });
}
