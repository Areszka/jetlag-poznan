import { NextResponse } from "next/server";
import { Game, Role, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { User } from "@/app/(protected)/game/create/reducer";

export type GetGamesResponse = { games: Array<Game & { isActive: boolean; rounds: Array<Round> }> };

export async function GET() {
  const userId = await validateSession();
  const games = await db.game.findMany({
    where: {
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
      rounds: true,
    },
  });

  return NextResponse.json<GetGamesResponse>({
    games: [
      ...games.map((game) => {
        const gameHasUnfinishedRound = game.rounds.some((round) => round.end_time === null);
        return { ...game, isActive: gameHasUnfinishedRound };
      }),
    ],
  });
}

export type PostGamesRequest = {
  name: string;
  teams: Array<{ name: string; role: Role; members: Array<User> }>;
  questionIds: Array<string>;
  /**
   * Order of the throw-curse matters as difficulty increases from 1 to n
   */
  curseIds: Array<string>;
  answerTimeLimit: number;
  jailDuration: number;
  diceCost: number;
};
export type PostGamesResponse = {
  game: Game & {
    rounds: Array<{ id: string }>;
  };
};
export async function POST(request: Request) {
  const userId = await validateSession();
  const body: PostGamesRequest = await request.json();

  if (body.teams.length < 2) {
    return Error(
      `Required at least 2 teams, got ${body.teams.length}. Add more teams to create a game`
    );
  }

  const playersIds: string[] = [];
  body.teams.forEach((team) => team.members.forEach((member) => playersIds.push(member.id)));

  const usersAlreadyPlaying = await db.user.findMany({
    where: {
      id: {
        in: playersIds,
      },
      teams: {
        some: {
          rounds: {
            some: {
              round: {
                end_time: null,
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (usersAlreadyPlaying.length > 0) {
    let errorMessage;
    if (usersAlreadyPlaying.length === 1) {
      errorMessage = `Player ${usersAlreadyPlaying[0].username} is currenlty playing another game`;
    } else {
      errorMessage = `Players ${usersAlreadyPlaying.map((p) => p.username).join(", ")} are currenlty playing another game`;
    }
    return Error(errorMessage);
  }

  const teamsWithNoMembers: string[] = [];

  body.teams.forEach((team) => {
    if (team.members.length < 1) {
      teamsWithNoMembers.push(team.name);
    }
  });

  if (teamsWithNoMembers.length > 0) {
    return Error(`Team ${teamsWithNoMembers[0]} have no members`);
  }

  const gameHasSeeker = body.teams.some((team) => team.role === Role.SEEKER);

  if (!gameHasSeeker) {
    return Error(`At least one team needs to be a seeker`);
  }

  const gameHasOneHider = body.teams.filter((team) => team.role === Role.HIDER).length === 1;

  if (!gameHasOneHider) {
    return Error(`Too many hiders, only one is allowed`);
  }

  const game = await db.game.create({
    data: {
      name: body.name,
      ownerId: userId,
      game_questions: {
        connect: body.questionIds.map((id) => {
          return { id };
        }),
      },
      game_curses: {
        create: body.curseIds.map((id, index) => {
          return { difficulty: index + 1, curse: { connect: { id } } };
        }),
      },
      answer_time_limit: body.answerTimeLimit,
      dice_cost: body.diceCost,
      jail_duration: body.jailDuration,
      rounds: {
        create: [
          {
            teams: {
              create: body.teams.map((team) => {
                return {
                  role: team.role,
                  team: {
                    create: {
                      name: team.name,
                      members: {
                        connect: team.members.map(({ id }) => {
                          return { id };
                        }),
                      },
                    },
                  },
                };
              }),
            },
          },
        ],
      },
    },
    include: {
      rounds: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json<PostGamesResponse>({ game });
}

function Error(message: string) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status: 400,
    }
  );
}
