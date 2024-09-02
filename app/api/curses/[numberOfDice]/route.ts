import { NextResponse } from "next/server";
import { db } from "../../db";

export async function GET(_: Request, { params }: { params: { numberOfDice: string } }) {
  const numberOfDice = Number(params.numberOfDice);
  const dice = [];

  const maxCurseId = await db.curse.count();

  for (let i = 0; i < numberOfDice; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }

  let nextCurseId = dice.reduce((p, c) => p + c, 0);

  if (nextCurseId > maxCurseId) {
    nextCurseId = Math.min(1, nextCurseId - maxCurseId);
  }

  const curse = await db.curse.findFirst({
    where: {
      difficulty: nextCurseId,
    },
  });

  return NextResponse.json({ curse, dice });
}

function parseNumberOfDice(input: string) {
  const inputNumber = Number(input);
  if (Number.isNaN(inputNumber) || !Number.isInteger(inputNumber)) {
    throw new Error(`Invalid number, got ${input}`);
  }
  if (inputNumber < 1) {
    throw new Error(`Number of dice must be greater than 0`);
  }
  // TODO: Check if there's enough money
}
