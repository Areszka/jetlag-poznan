import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Round } from "@prisma/client";
import { sendNotification } from "@/app/(protected)/actions";

export type PatchRoundResponse = {
  round: Round;
};
export async function PATCH(
  _request: Request,
  { params }: { params: { gameId: string; roundId: string } }
) {
  const userId = await validateSession();
  const startedAt = new Date();

  const updatedRound = await db.round.update({
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
    data: {
      start_time: startedAt,
    },
    include: {
      game: true,
      teams: {
        include: {
          team: {
            include: { members: true },
          },
        },
      },
    },
  });

  if (updatedRound) {
    const playersIds: string[] = updatedRound.teams.flatMap((team) =>
      team.team.members.flatMap((member) => member.id)
    );

    setTimeout(async () => {
      await sendNotification(
        `Jail period is over!`,
        "From now on Hiders cannot leave their district",
        playersIds
      );
    }, updatedRound.game.jail_duration);
  }

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
