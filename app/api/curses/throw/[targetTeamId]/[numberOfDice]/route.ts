import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { TeamRoundCurse } from "@prisma/client";

export type ThrowCurseResponse = {
  curse: TeamRoundCurse;
  dice: number[];
};
export async function GET(
  _request: Request,
  { params }: { params: { numberOfDice: string; targetTeamId: string } },
) {
  const userId = await validateSession();

  // Throw if the user is not in the target team or not a hider
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "HIDER",
      team: {
        id: params.targetTeamId,
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
  const costPerDice = 50;
  const cost = costPerDice * numberOfDice;

  const team = await db.team.update({
    where: {
      id: params.targetTeamId,
      coins: {
        gte: cost,
      },
    },
    data: {
      coins: {
        decrement: cost,
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
    nextCurseDifficulty = Math.abs(
      2 * maxCurseDifficulty - nextCurseDifficulty,
    );
  }

  const gameCurse = await db.gameCurse.findFirstOrThrow({
    where: {
      gameId: game.id,
      difficulty: nextCurseDifficulty,
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
