import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Question, TeamRoundQuestion } from "@prisma/client";

export type AnswerQuestionRequest = {
  answer: string;
};

export type AnswerQuestionResponse = {
  question: TeamRoundQuestion & { question: Question };
};
export async function POST(
  request: Request,
  { params }: { params: { questionId: string; teamId: string } },
) {
  const userId = await validateSession();

  const { answer } = (await request.json()) as AnswerQuestionRequest;

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

  const answerResponse = await db.teamRoundQuestion.update({
    where: {
      teamId_questionId_roundId: {
        questionId: params.questionId,
        teamId: params.teamId,
        roundId: lastRound.roundId,
      },
    },
    data: {
      answered_at: new Date(),
      answer,
    },
  });

  if (!answerResponse) {
    return NextResponse.json(
      {
        error: `Couldn't find a question ${params.questionId} for team ${params.teamId} in active round`,
      },
      { status: 400 },
    );
  }

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

  return NextResponse.json<AnswerQuestionResponse>({
    question,
  });
}