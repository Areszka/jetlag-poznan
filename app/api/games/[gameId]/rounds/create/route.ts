import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";
import { Round } from "@prisma/client";

export type PostRoundResponse = {
  round: Round;
};

export async function POST(
  _request: Request,
  { params }: { params: { gameId: string } },
) {
  const userId = await validateSession();

  const previousRounds = await db.round.findMany({
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
      end_time: true,
      teams: {
        include: {
          team: {
            select: {
              id: true,
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

  const teams = [...previousRounds[previousRounds.length - 1].teams];
  const nextTeams = teams.map((team, index) => {
    if (index === teams.length - 1) {
      return { ...team, role: teams[0].role };
    }
    return { ...team, role: teams[index + 1].role };
  });

  const unfinishedRoundExists = previousRounds.some((round) => !round.end_time);

  if (unfinishedRoundExists) {
    return NextResponse.json(null, {
      statusText: "There is an unfinished round!",
      status: 400,
    });
  }

  const round = await db.round.create({
    data: {
      gameId: params.gameId,
      teams: {
        create: nextTeams.map((team) => {
          return {
            role: team.role,
            team: {
              connect: {
                id: team.teamId,
              },
            },
          };
        }),
      },
    },
  });

  return NextResponse.json<PostRoundResponse>({ round });
}
