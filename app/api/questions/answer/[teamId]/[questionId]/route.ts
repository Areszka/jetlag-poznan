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
  { params }: { params: { questionId: string; teamId: string } }
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
    include: {
      question: true,
    },
  });

  if (!answerResponse) {
    return NextResponse.json(
      {
        error: `Couldn't find a question ${params.questionId} for team ${params.teamId} in active round`,
      },
      { status: 400 }
    );
  }

  const question = await db.question.findFirstOrThrow({
    where: {
      id: params.questionId,
    },
    select: {
      cost: true,
    },
  });

  if (answer !== "Hiders didn't manage to answer before time ran out") {
    const updatedTeamRound = await db.teamRound.update({
      where: {
        teamId_roundId: {
          teamId: params.teamId,
          roundId: lastRound.roundId,
        },
      },
      data: {
        coins: {
          increment: question.cost,
        },
      },
    });

    if (!updatedTeamRound) {
      return NextResponse.json(
        {
          error: `Couldn't update number of coins`,
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json<AnswerQuestionResponse>({
    question: answerResponse,
  });
}
