import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Curse, TeamRoundCurse } from "@prisma/client";
import { sendNotification } from "@/app/utils/actions";

export type ThrowCurseResponse = {
  curse: TeamRoundCurse & { curse: Curse };
};

export async function POST(
  _request: Request,
  { params }: { params: { difficulty: string; targetTeamId: string } }
) {
  const userId = await validateSession();

  // Throw if the user is not in the target team or not a hider
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "HIDER",
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      round: {
        end_time: null,
      },
    },
  });

  const game = await db.game.findFirstOrThrow({
    where: {
      rounds: {
        some: {
          id: lastRound.roundId,
        },
      },
    },
  });

  const difficulty = parseDifficulty(params.difficulty);
  const cost = game.curse_costs[difficulty - 1];

  const team = await db.teamRound.update({
    where: {
      teamId_roundId: {
        roundId: lastRound.roundId,
        teamId: params.targetTeamId,
      },
      coins: {
        gte: cost,
      },
    },
    data: {
      coins: {
        decrement: cost,
      },
    },
    include: {
      team: {
        include: {
          members: {
            select: { id: true },
          },
        },
      },
    },
  });
  if (!team) {
    return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
  }

  const cursesOfDesiredDifficulty = await db.gameCurse.findMany({
    where: {
      gameId: game.id,
      difficulty: difficulty,
    },
    select: {
      curseId: true,
    },
  });

  const alreadyPlayedCurses = await db.teamRoundCurse.findMany({
    where: {
      roundId: lastRound.roundId,
      teamId: params.targetTeamId,
      curseId: {
        in: cursesOfDesiredDifficulty.map((curse) => curse.curseId),
      },
    },
  });

  const rolledCurse = getNextCurse(
    cursesOfDesiredDifficulty.map((c) => c.curseId),
    alreadyPlayedCurses.map((c) => c.curseId)
  );

  const curse = await db.teamRoundCurse.create({
    data: {
      curseId: rolledCurse,
      teamId: params.targetTeamId,
      roundId: lastRound.roundId,
    },
    include: {
      curse: true,
    },
  });

  await sendNotification({
    title: `You've been cursed!`,
    message: curse.curse.name,
    targetUsersIds: team.team.members.map((member) => member.id),
    url: `/game/${game.id}/rounds/${lastRound.roundId}/curses`,
  });

  return NextResponse.json<ThrowCurseResponse>({
    curse,
  });
}

function parseDifficulty(input: string) {
  const inputNumber = Number(input);
  if (Number.isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
    throw new Error(`Invalid number, got ${input}`);
  }
  if (inputNumber < 1 || inputNumber > 3) {
    throw new Error(`Number of dice must be greater than 0 and less than 3, got ${input}`);
  }
  return inputNumber;
}

function getNextCurse(curses: string[], previousCurses: string[]) {
  const rolledCurse = Math.floor(Math.random() * curses.length);

  if (previousCurses.length >= curses.length) {
    return curses[rolledCurse];
  }

  if (previousCurses.includes(curses[rolledCurse])) {
    return getNextCurse(curses, previousCurses);
  }

  return curses[rolledCurse];
}
