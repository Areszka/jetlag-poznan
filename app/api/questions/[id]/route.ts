import { Question } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export type PutQuestionsRequest = {
  content: string;
  details: string;
  cost: number;
  type: string;
};
export type PutQuestionsResponse = { question: Question };
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await validateSession();
  const { content, details, cost, type } =
    (await request.json()) as PutQuestionsRequest;

  const updatedQuestion = await db.question.update({
    where: {
      id: params.id,
      ownerId: userId,
    },
    data: {
      content,
      details,
      cost,
      type,
    },
  });

  return NextResponse.json<PutQuestionsResponse>({ question: updatedQuestion });
}

export type DeleteQuestionsResponse = { question: Question };
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const userId = await validateSession();

  const deletedQuestion = await db.question.delete({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });

  return NextResponse.json<DeleteQuestionsResponse>({
    question: deletedQuestion,
  });
}
