import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type FlatCurse = {
  id: string;
  difficulty: number | null;
  name: string;
  effect: string;
  teamId: string;
  created_at: Date;
  vetoed_at: Date | null;
  lifted_at: Date | null;
};

export type GetGameCursesResponse = {
  curses: FlatCurse[];
};

export async function GET(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();

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
      curses: {
        orderBy: {
          created_at: "desc",
        },
        include: {
          curse: true,
        },
      },
      game: {
        select: {
          game_curses: true,
        },
      },
    },
  });

  return NextResponse.json<GetGameCursesResponse>({
    curses: round.curses.map((curse) => {
      const gameCurse = round.game.game_curses.find((c) => c.curseId === curse.curseId);

      if (!gameCurse) {
        throw Error("Question not found");
      }

      return {
        ...curse,
        ...curse.curse,
        difficulty: gameCurse.difficulty,
      };
    }),
  });
}
