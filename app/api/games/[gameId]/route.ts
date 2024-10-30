import { db } from "../../db";
import { NextResponse } from "next/server";
import { Curse, Game, GameCurse, Question } from "@prisma/client";
import { validateSession } from "@/app/api/auth";

export type GetGameResponse = {
  game: Game & { game_curses: (GameCurse & Curse)[]; game_questions: Question[] };
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
      game_curses: {
        include: {
          curse: true,
        },
      },
      game_questions: true,
    },
  });

  return NextResponse.json<GetGameResponse>({
    game: {
      ...game,
      game_curses: game.game_curses.map((gameCurse) => {
        return { ...gameCurse, ...gameCurse.curse };
      }),
    },
  });
}

export type DeleteGamesResponse = { game: Game };
export async function DELETE(_request: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();
  const game = await db.game.delete({
    where: { id: params.gameId, ownerId: userId },
  });

  return NextResponse.json<DeleteGamesResponse>({ game });
}
