import { db } from "../../db";

import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { username: string } }) {
  const user = await db.user.findFirst({
    where: {
      username: params.username,
    },
  });

  if (user === null) {
    return NextResponse.json(
      {},
      { status: 400, statusText: `User "${params.username}" does not exist` }
    );
  }

  return NextResponse.json(user);
}
