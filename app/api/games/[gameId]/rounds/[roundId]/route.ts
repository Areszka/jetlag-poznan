import { NextResponse } from "next/server";
import {
  Curse,
  Game,
  Question,
  Round,
  TeamRound,
  TeamRoundCurse,
  TeamRoundQuestion,
} from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type FlatTeamRound = TeamRound & {
  name: string;
  members: Array<{ id: string }>;
};

export type ExpandedRound = Round & {
  teams: Array<FlatTeamRound>;
  curses: Array<TeamRoundCurse & { curse: Curse }>;
  questions: Array<TeamRoundQuestion>;
  game: Game & { game_questions: Array<Question> };
};

export type GetRoundResponse = {
  round: ExpandedRound;
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
      questions: true,
      game: {
        include: {
          game_questions: true,
        },
      },
    },
  });

  return NextResponse.json<GetRoundResponse>({
    round: {
      ...round,
      teams: [
        ...round.teams.map((team) => {
          return {
            name: team.team.name,
            members: team.team.members,
            teamId: team.teamId,
            roundId: team.roundId,
            coins: team.coins,
            role: team.role,
          };
        }),
      ],
    },
  });
}
