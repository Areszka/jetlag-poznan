import { NextResponse } from "next/server";
import { Curse, GameCurse, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetGameCursesResponse = { curses: Array<GameCurse & { curse: Curse }> };

export async function GET(_request: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();

  const curses = await db.gameCurse.findMany({
    orderBy: {
      difficulty: "asc",
    },
    where: {
      gameId: params.gameId,
      game: {
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
    },
    include: {
      curse: true,
    },
  });

  return NextResponse.json<GetGameCursesResponse>({ curses });
}
