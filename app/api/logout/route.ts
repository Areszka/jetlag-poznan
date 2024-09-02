import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Logged out",
    },
    {
      headers: {
        "Set-Cookie": `jetlag_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`,
      },
    },
  );
}
