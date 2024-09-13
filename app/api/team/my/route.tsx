import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Curse, Team } from "@prisma/client";

export type GetTeamResponse = { team: Team };
export async function GET() {
  const userId = await validateSession();

  const team = await db.team.findFirst({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (!team) {
    throw new Error("Error.... 🙄🙄");
  }

  return NextResponse.json<GetTeamResponse>({ team });
}
