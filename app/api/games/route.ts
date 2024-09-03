import { db } from "../db";

import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { GameState } from "@/app/game/create/reducer";

export async function GET() {
  const games = await db.game.findMany();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  const body: GameState = await request.json();

  if (body.teams.length < 2) {
    return NextResponse.json(null, {
      status: 400,
      statusText: `Required at least 2 teams, got ${body.teams.length}. Add more teams to create a game`,
    });
  }

  const teamsWithNoMembers: string[] = [];

  body.teams.forEach((team) => {
    if (team.membersUsernames.length < 1) {
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

  const gameHasHider = body.teams.some((team) => team.role === Role.HIDER);

  if (!gameHasHider) {
    return NextResponse.json(null, { status: 400, statusText: `There must be one hider` });
  }

  const game = await db.game.create({
    data: {
      name: body.name,
      teams: {
        create: body.teams.map((team) => {
          return {
            name: team.name,
            role: team.role,
            members: {
              connect: team.membersUsernames.map((username) => {
                return { username };
              }),
            },
          };
        }),
      },
    },
  });

  return NextResponse.json(game);
}
