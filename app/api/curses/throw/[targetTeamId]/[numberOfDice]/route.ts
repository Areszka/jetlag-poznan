import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Curse, TeamRoundCurse } from "@prisma/client";
import { sendNotification } from "@/app/utils/actions";

export type ThrowCurseResponse = {
  curse: TeamRoundCurse & { curse: Curse };
  dice: number[];
};

export async function POST(
  _request: Request,
  { params }: { params: { numberOfDice: string; targetTeamId: string } }
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

  const numberOfDice = parseNumberOfDice(params.numberOfDice);
  const cost = game.dice_cost * numberOfDice;

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

  const dice = [];

  const maxCurseDifficulty = await db.gameCurse.count({
    where: {
      gameId: game.id,
    },
  });

  for (let i = 0; i < numberOfDice; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }

  let nextCurseDifficulty = dice.reduce((p, c) => p + c, 0);

  while (nextCurseDifficulty > maxCurseDifficulty) {
    nextCurseDifficulty = Math.abs(2 * maxCurseDifficulty - nextCurseDifficulty);
  }

  const alreadyPlayedCurses = await db.teamRoundCurse.findMany({
    where: {
      roundId: lastRound.roundId,
      teamId: params.targetTeamId,
    },
  });

  const alreadyPlayedCurseDifficulties = await db.gameCurse.findMany({
    where: {
      gameId: game.id,
      curseId: {
        in: alreadyPlayedCurses.map((curse) => curse.curseId),
      },
    },
  });

  const computedNextCurseDifficulty = getNextCurseDifficulty(
    nextCurseDifficulty,
    alreadyPlayedCurseDifficulties.map((curse) => curse.difficulty),
    maxCurseDifficulty
  );

  const gameCurse = await db.gameCurse.findFirstOrThrow({
    where: {
      gameId: game.id,
      difficulty: computedNextCurseDifficulty,
    },
    include: {
      curse: true,
    },
  });

  const curse = await db.teamRoundCurse.create({
    data: {
      curseId: gameCurse.curseId,
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
    dice,
  });
}

function parseNumberOfDice(input: string) {
  const inputNumber = Number(input);
  if (Number.isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
    throw new Error(`Invalid number, got ${input}`);
  }
  if (inputNumber < 1) {
    throw new Error(`Number of dice must be greater than 0`);
  }
  return inputNumber;
}

/**
 * Returns the next curse difficulty based on the target curse difficulty and the previous curse difficulties.
 * @example
 * getNextCurseDifficulty(1, [1, 2, 3],10); // 4
 * getNextCurseDifficulty(2, [2], 10); // 1
 * getNextCurseDifficulty(3, [2, 3], 10); // 4
 * getNextCurseDifficulty(10, [], 10); // 10
 * getNextCurseDifficulty(10, [9, 10], 10); // 8
 */
function getNextCurseDifficulty(
  targetCurseDifficulty: number,
  previousCurseDifficulties: number[],
  maxCurseDifficulty: number
) {
  const cursesToTry = [targetCurseDifficulty];

  for (let i = 1; i <= maxCurseDifficulty; i++) {
    if (targetCurseDifficulty - i > 0) {
      cursesToTry.push(targetCurseDifficulty - i);
    }
    if (targetCurseDifficulty + i <= maxCurseDifficulty) {
      cursesToTry.push(targetCurseDifficulty + i);
    }
  }

  const nextCurseDifficulty = cursesToTry.find(
    (curse) => !previousCurseDifficulties.includes(curse)
  );

  if (!nextCurseDifficulty) {
    throw new Error(`Could not find a curse difficulty that has not been played yet`);
  }

  return nextCurseDifficulty;
}
