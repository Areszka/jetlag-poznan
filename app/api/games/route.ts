import { db } from "../db";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const game = db.games.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(game);
}

export async function GET() {
  const games = await db.games.findMany();
  return NextResponse.json(games);
}
