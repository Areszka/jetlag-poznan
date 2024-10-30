import { NextResponse } from "next/server";
import { Role, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetRoundResponseTemp = {
  round: Round & {
    teams: { members: { id: string; username: string }[]; name: string; role: Role; id: string }[];
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
        include: {
          team: {
            include: {
              members: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json<GetRoundResponseTemp>({
    round: {
      ...round,
      teams: round.teams.map((team) => {
        return {
          id: team.teamId,
          role: team.role,
          name: team.team.name,
          members: team.team.members,
        };
      }),
    },
  });
}
