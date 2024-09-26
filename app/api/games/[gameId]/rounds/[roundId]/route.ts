import { NextResponse } from "next/server";
import {
  Game,
  GameCurse,
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
  members: Array<{ id: string; username: string }>;
};

export type FlatGameCurse = GameCurse & {
  name: string;
  effect: string;
};

export type ExpandedRound = Round & {
  teams: Array<FlatTeamRound>;
  curses: Array<TeamRoundCurse>;
  questions: Array<TeamRoundQuestion>;
  game: Game & { game_questions: Array<Question>; game_curses: Array<FlatGameCurse> };
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
                  username: true,
                },
              },
            },
          },
        },
      },
      curses: true,
      questions: true,
      game: {
        include: {
          game_questions: true,
          game_curses: {
            include: {
              curse: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json<GetRoundResponse>({
    round: {
      ...round,
      game: {
        ...round.game,
        game_curses: [
          ...round.game.game_curses.map((gameCurse) => {
            return {
              ...gameCurse,
              ...gameCurse.curse,
            };
          }),
        ],
      },
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
