import { NextResponse } from "next/server";
import { Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetRoundsResponse = { rounds: Array<Round> };

export async function GET(_request: Request, { params }: { params: { gameId: string } }) {
  const userId = await validateSession();
  const rounds = await db.round.findMany({
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
  });

  return NextResponse.json<GetRoundsResponse>({ rounds });
}
