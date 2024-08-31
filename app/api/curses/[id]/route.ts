import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET({ url }: Request) {
  const index = url.lastIndexOf("/");
  const numberOfDice: number = Number(url.substring(index + 1));

  const dices = [];

  const maxCurseId = 18;

  for (let i = 0; i < numberOfDice; i++) {
    dices.push(Math.floor(Math.random() * 6) + 1);
  }

  let nextCurseId = dices.reduce((p, c) => p + c);

  if (nextCurseId > maxCurseId) {
    nextCurseId = Math.min(1, nextCurseId - maxCurseId);
  }

  const { rows } = await sql`SELECT * from curses where id=${nextCurseId}`;

  return NextResponse.json({ curse: rows[0], dices: dices });
}
