import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { Question } from "@prisma/client";

export type GetQuestionsResponse = { questions: Array<Question> };

export async function GET() {
  const userId = await validateSession();
  const questions = await db.question.findMany({
    where: {
      ownerId: userId,
    },
  });

  return NextResponse.json<GetQuestionsResponse>({ questions });
}

export type PostQuestionsRequest = {
  content: string;
  details: string;
  cost: number;
  type: string;
};
export type PostQuestionsResponse = { question: Question };
export async function POST(request: Request) {
  const userId = await validateSession();
  const { content, details, cost, type } =
    (await request.json()) as PostQuestionsRequest;

  const newQuestion = await db.question.create({
    data: {
      ownerId: userId,
      content,
      details,
      cost,
      type,
    },
  });

  return NextResponse.json<PostQuestionsResponse>({ question: newQuestion });
}
