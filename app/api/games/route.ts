import { db } from "../db";

import { NextResponse } from "next/server";
import { GameSettings } from "@/app/game/create/page";

export async function GET() {
  const games = await db.game.findMany();
  return NextResponse.json(games);
}

export async function POST(request: Request) {
  const body: GameSettings = await request.json();

  if (body.teams.length < 2) {
    return NextResponse.json(
      {
        error: `Required at least 2 teams, got ${body.teams.length}. Add more teams to create a game`,
      },
      { status: 400 }
    );
  }

  if (body.teams.some((team) => team.playersUsernames.length < 1)) {
    return NextResponse.json(
      {
        error: `Some teams have no members`,
      },
      { status: 400 }
    );
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
              connect: team.playersUsernames.map((username) => {
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
