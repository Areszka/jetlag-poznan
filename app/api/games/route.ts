import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { rows } = await sql`INSERT INTO games (name) VALUES (${body.name}) RETURNING *;`;

  return NextResponse.json(rows);
}

export async function GET() {
  const { rows } = await sql`SELECT * FROM games`;
  return NextResponse.json(rows);
}
