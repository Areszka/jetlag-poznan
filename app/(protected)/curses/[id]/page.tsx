import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { CurseForm } from "@/app/(protected)/curses/CurseForm";

export default async function Page({ params }: { params: { id: string } }) {
  const userId = await validateSession();
  const initialValues = await db.curse.findFirstOrThrow({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });
  console.log("initial", initialValues);
  return <CurseForm type="edit" initialValues={initialValues} id={params.id} />;
}
