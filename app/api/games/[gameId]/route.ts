import { db } from "../../db";
import { NextResponse } from "next/server";
import { Game, Question, Round, Team, TeamRound, User } from "@prisma/client";
import { validateSession } from "@/app/api/auth";

export type GetGameResponse = {
  game: Game & {
    rounds: Array<
      Round & {
        teams: Array<
          TeamRound & {
            team: Team & { members: Array<Pick<User, "username" | "id">> };
          }
        >;
      }
    >;
    game_questions: Array<Question>;
  };
};
export async function GET(_: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();
  const game = await db.game.findFirstOrThrow({
    where: {
      id: params.gameId,
      rounds: {
        some: {
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
      },
    },
    include: {
      game_questions: true,
      rounds: {
        include: {
          teams: {
            include: {
              team: {
                include: {
                  questions: {
                    select: {
                      questionId: true,
                      question: true,
                    },
                  },
                  members: {
                    select: {
                      username: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json<GetGameResponse>({ game });
}

export type DeleteGamesResponse = { game: Game };
export async function DELETE(_request: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();
  const game = await db.game.delete({
    where: { id: params.gameId, ownerId: userId },
  });

  return NextResponse.json<DeleteGamesResponse>({ game });
}
