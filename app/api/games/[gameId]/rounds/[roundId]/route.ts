import { NextResponse } from "next/server";
import { Curse, Round, Team, TeamRound, TeamRoundCurse, User } from "@prisma/client";
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
    },
  });

  return NextResponse.json<GetRoundResponse>({ round });
}
