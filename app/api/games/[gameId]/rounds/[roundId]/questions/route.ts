import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { Team } from "@prisma/client";

export type FlatQuestion = {
  id: string;
  content: string;
  type: string;
  cost: number;
  details: string | null;
  askedBy?: Team;
  created_at: Date | null;
  answered_at: Date | null;
  answer: string | null;
};

export type GetGameQuestionsResponse = {
  questions: FlatQuestion[];
};

export async function GET(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();

  const userTeam = await db.teamRound.findFirstOrThrow({
    where: {
      roundId: params.roundId,
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    },
  });
  const round = await db.round.findFirstOrThrow({
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
    include: {
      teams: {
        include: {
          team: true,
        },
      },
      questions: true,
      game: {
        include: {
          game_questions: true,
        },
      },
    },
  });

  if (userTeam.role === "SEEKER") {
    return NextResponse.json<GetGameQuestionsResponse>({
      questions: [
        ...round.game.game_questions.map((gameQuestion) => {
          const roundQuestion = round.questions.find(
            (q) => q.questionId === gameQuestion.id && q.teamId == userTeam.teamId
          );
          return {
            id: gameQuestion.id,
            content: gameQuestion.content,
            type: gameQuestion.type,
            cost: gameQuestion.cost,
            details: gameQuestion.details,
            created_at: roundQuestion?.created_at ?? null,
            answered_at: roundQuestion?.answered_at ?? null,
            answer: roundQuestion?.answer ?? null,
          };
        }),
      ].toSorted((a, b) => compareFn(a.created_at, b.created_at)),
    });
  }

  return NextResponse.json<GetGameQuestionsResponse>({
    questions: round.questions
      .map((roundQuestion) => {
        const gameQuestion = round.game.game_questions.find(
          (q) => q.id === roundQuestion.questionId
        );

        if (!gameQuestion) {
          throw Error("Question not found");
        }

        return {
          id: gameQuestion.id,
          content: gameQuestion.content,
          type: gameQuestion.type,
          cost: gameQuestion.cost,
          details: gameQuestion.details,
          askedBy: round.teams.find((team) => team.teamId === roundQuestion.teamId)?.team,
          created_at: roundQuestion.created_at,
          answered_at: roundQuestion.answered_at,
          answer: roundQuestion.answer,
        };
      })
      .toSorted((a, b) => compareFn(a.created_at, b.created_at)),
  });
}

function compareFn(a: Date | null, b: Date | null) {
  if (a) {
    if (!b) {
      return -1;
    }
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  }
  if (b) {
    return 1;
  }

  return 0;
}
