import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";
import { Round } from "@prisma/client";

export type PostRoundResponse = {
  round: Round;
};

export async function POST(_request: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();

  const previousRound = await db.round.findMany({
    where: {
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
    select: {
      teams: {
        include: {
          team: {
            select: {
              name: true,
              members: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const teams = [...previousRound[previousRound.length - 1].teams];
  const nextTeams = teams.map((team, index) => {
    if (index === teams.length - 1) {
      return { ...team, role: teams[0].role };
    }
    return { ...team, role: teams[index + 1].role };
  });

  const round = await db.round.create({
    data: {
      gameId: params.gameId,
      teams: {
        create: nextTeams.map((team) => {
          return {
            role: team.role,
            team: {
              create: {
                name: team.team.name,
                members: {
                  connect: team.team.members.map((member) => {
                    return {
                      id: member.id,
                    };
                  }),
                },
              },
            },
          };
        }),
      },
    },
  });

  return NextResponse.json<PostRoundResponse>({ round });
}
