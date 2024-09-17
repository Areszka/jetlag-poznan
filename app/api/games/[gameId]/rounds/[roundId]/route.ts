import { NextResponse } from "next/server";
import {
  Curse,
  Game,
  Question,
  Round,
  Team,
  TeamRound,
  TeamRoundCurse,
  TeamRoundQuestion,
} from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetRoundResponse = {
  round: Round & {
    teams: Array<
      TeamRound & {
        team: Team & {
          members: Array<{ id: string }>;
        };
      }
    >;
    curses: Array<TeamRoundCurse & { curse: Curse }>;
    questions: Array<TeamRoundQuestion & { team: Team }>;
    game: Game & { questions: Array<Question> };
  };
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
      teams: {
        orderBy: {
          team: {
            name: "asc",
          },
        },

        include: {
          team: {
            include: {
              members: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      curses: {
        include: {
          curse: true,
        },
      },
      questions: {
        include: {
          team: true,
        },
      },
      game: {
        include: {
          questions: true,
        },
      },
    },
  });

  return NextResponse.json<GetRoundResponse>({ round });
}
