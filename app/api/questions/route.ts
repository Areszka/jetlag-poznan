import { NextResponse } from "next/server";
import { db } from "../db";

export async function GET(request: Request) {
  const questions = await db.question.findMany();
  return NextResponse.json({ questions });
}
