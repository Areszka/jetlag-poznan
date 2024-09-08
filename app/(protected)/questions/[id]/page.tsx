import { QuestionForm } from "@/app/(protected)/questions/QuestionForm";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const userId = await validateSession();
  const initialValues = await db.question.findFirstOrThrow({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });
  console.log("initial", initialValues);
  return (
    <QuestionForm type="edit" initialValues={initialValues} id={params.id} />
  );
}
