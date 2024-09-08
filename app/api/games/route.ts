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
export type PostGamesResponse = { game: Game };
export async function POST(request: Request) {
  const userId = await validateSession();
  const body: PostGamesRequest = await request.json();

  if (body.teams.length < 2) {
    return NextResponse.json(null, {
      status: 400,
      statusText: `Required at least 2 teams, got ${body.teams.length}. Add more teams to create a game`,
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
      statusText: `There must be one hider`,
    });
  }

  console.log("BEFORE");
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
                  name: team.name,
                  role: team.role,
                  members: {
                    connect: team.members.map(({ id }) => {
                      return { id };
                    }),
                  },
                };
              }),
            },
          },
        ],
      },
    },
  });

  console.log("AFTER");
  console.log(game);

  return NextResponse.json<PostGamesResponse>({ game });
}
