import { NextResponse } from "next/server";
import { Game, Role } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { User } from "@/app/(protected)/game/create/reducer";

export type GetGamesResponse = { games: Array<Game> };

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
  });

  return NextResponse.json<GetGamesResponse>({ games });
}

export type PostGamesRequest = {
  name: string;
  teams: Array<{ name: string; role: Role; members: Array<User> }>;
  questionIds: Array<string>;
  /**
   * Order of the throw-curse matters as difficulty increases from 1 to n
   */
  curseIds: Array<string>;
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
    return NextResponse.json(null, {
      status: 400,
      statusText: `Required at least 2 teams, got ${body.teams.length}. Add more teams to create a game`,
    });
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
    let statusText;
    if (usersAlreadyPlaying.length === 1) {
      statusText = `Player ${usersAlreadyPlaying[0].username} is currenlty playing another game`;
    } else {
      statusText = `Players ${usersAlreadyPlaying.map((p) => p.username).join(", ")} are currenlty playing another game`;
    }
    return NextResponse.json(null, {
      status: 400,
      statusText,
    });
  }

  const teamsWithNoMembers: string[] = [];

  body.teams.forEach((team) => {
    if (team.members.length < 1) {
      teamsWithNoMembers.push(team.name);
    }
  });

  if (teamsWithNoMembers.length > 0) {
    return NextResponse.json(null, {
      status: 400,
      statusText: `Team ${teamsWithNoMembers[0]} have no members`,
    });
  }

  const gameHasSeeker = body.teams.some((team) => team.role === Role.SEEKER);

  if (!gameHasSeeker) {
    return NextResponse.json(null, {
      status: 400,
      statusText: `At least one team needs to be a seeker`,
    });
  }

  const gameHasOneHider = body.teams.filter((team) => team.role === Role.HIDER).length === 1;

  if (!gameHasOneHider) {
    return NextResponse.json(null, {
      status: 400,
      statusText: `Too many hiders, only one is allowed`,
    });
  }

  const game = await db.game.create({
    data: {
      name: body.name,
      ownerId: userId,
      questions: {
        connect: body.questionIds.map((id) => {
          return { id };
        }),
      },
      curses: {
        create: body.curseIds.map((id, index) => {
          return { difficulty: index + 1, curse: { connect: { id } } };
        }),
      },
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
